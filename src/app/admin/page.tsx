import type { Metadata } from "next"
import { InvoiceDesk } from "@/components/admin/invoice-desk"
import "./admin.css"

export const metadata: Metadata = {
  title: { absolute: "Invoices · OZ Studio" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function AdminPage() {
  return <InvoiceDesk />
}
