// .opencode/plugins/agent-model-sync/index.ts
//
// エージェント切替時に、エージェント定義の model をセッションへ自動適用する
// サーバープラグイン。
//
// 仕様背景:
//   - セッションの選択モデルはエージェントとは別に保持される
//   - Session.switchAgent はエージェント定義の model を適用しない
//   - 本プラグインは session.agent.selected を購読し、エージェント定義の
//     model が設定されていれば ctx.session.switchModel でセッションへ反映する
//
// イベントスキーマ (openapi.json より):
//   session.agent.selected の data は { sessionID, agent, previous? } であり、
//   エージェントID のフィールド名は agentID ではなく agent である。
//   location はスキーマ上オプションで、配信ペイロードには含まれないため、
//   ロケーションの判定は ctx.session.get の結果で行う。
//
// SDK の戻り値に関する注意 (OpenCode 2.4.2 での実測):
//   - ctx.session.get は Session.Info を直接返す
//   - ctx.agent.get は { location, data: Agent.Info } のラッパーを返す
//
// 再帰安全性:
//   switchModel は session.model.selected を出すが session.agent.selected は
//   出さないため、本購読が再帰することはない。

import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "agent-model-sync",
  async setup(ctx) {
    const controller = new AbortController()

    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({
          types: ["session.agent.selected"],
          signal: controller.signal,
        })) {
          try {
            const sessionID = event.data.sessionID
            const agentID = event.data.agent
            if (!sessionID || !agentID) continue

            // このプラグインインスタンスのロケーション以外のセッションには
            // 関与しない。他ロケーションの agent 定義でセッションのモデルを
            // 上書きしてしまう事故を防ぐための一致チェックである。
            const session = await ctx.session.get({ sessionID })
            if (session?.location?.directory !== ctx.location.directory) continue

            // ctx.agent.get の返り値は { location, data: Agent.Info } の
            // ラッパーであるため、model は data 配下から読む。
            const result = await ctx.agent.get({ agentID })
            const model = result?.data?.model
            // model が未設定のエージェントでは何もしない。
            if (!model) continue

            await ctx.session.switchModel({
              sessionID,
              model: {
                providerID: model.providerID,
                id: model.id,
                ...(model.variant ? { variant: model.variant } : {}),
              },
            })
          } catch (err) {
            // 1 イベントの失敗でプラグイン全体を落とさない。
            console.error(`[agent-model-sync] model 同期失敗: ${err}`)
          }
        }
      } catch (err) {
        // abort 後のストリーム終了は正常なクリーンアップなので静かに抜ける。
        if (!controller.signal.aborted) {
          console.error(`[agent-model-sync] イベント購読が異常終了: ${err}`)
        }
      }
    })()

    return () => controller.abort()
  },
})
