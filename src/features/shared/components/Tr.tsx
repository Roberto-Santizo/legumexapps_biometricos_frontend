type Props = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Tr({children, className, onClick}: Props) {
  return (
     <tr className={`tbody-tr ${className ?? ''}`} onClick={onClick}>
        {children}
     </tr>
  )
}
