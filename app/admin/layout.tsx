import { ReactNode } from "react"

import { AdminClientWrapper } from "./client-wrapper"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>
}
