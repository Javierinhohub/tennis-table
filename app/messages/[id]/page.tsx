import ConversationClient from "./ConversationClient"

export default function ConversationPage({ params }: { params: { id: string } }) {
  return <ConversationClient conversationId={params.id} />
}
