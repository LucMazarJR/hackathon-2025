interface FormattedMessageProps {
  content: string
  isBot: boolean
}

export default function FormattedMessage({ content, isBot }: FormattedMessageProps) {
  if (!isBot) {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  // Mensagem de loading
  if (content === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <span><strong>Pensando...</strong></span>
      </div>
    )
  }

  // Formatação markdown para texto do bot
  const formatText = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>') // ### títulos
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-3">$1</h2>') // ## títulos
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>') // # títulos
      .replace(/^---$/gm, '<hr class="border-gray-300 my-4" />') // --- separador
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc list-inside">$1</li>') // - lista
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrito**
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // *itálico*
      .replace(/\n/g, '<br />') // quebras de linha
      .replace(/• /g, '• ') // bullets
  }

  return (
    <div 
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
    />
  )
}