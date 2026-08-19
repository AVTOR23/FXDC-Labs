import ApplicationManager, { StatusBadge } from "@/pages/ApplicationManager";

export default function TradingTools() {
  return (
    <ApplicationManager
      title="Trading tools applications"
      endpoint="/api/admin/trading-tools-applications"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "whatsapp", label: "WhatsApp" },
        {
          key: "status",
          label: "Status",
          render: (item) => <StatusBadge status={item.status} />,
        },
      ]}
    />
  );
}
