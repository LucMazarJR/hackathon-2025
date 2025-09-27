interface FormattedMessageProps {
  content: string
  isBot: boolean
}

export default function FormattedMessage({ content, isBot }: FormattedMessageProps) {
  if (!isBot) {
    return <div className="whitespace-pre-wrap">{content}</div>
  }

  // Formatação simples para texto do bot
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **negrito**
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