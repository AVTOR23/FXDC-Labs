import ApplicationManager, { StatusBadge } from "@/pages/ApplicationManager";

export default function LearningPath() {
  return (
    <ApplicationManager
      title="Learning path applications"
      endpoint="/api/admin/learning-path-applications"
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "telegram", label: "Telegram" },
        { key: "whatsapp", label: "WhatsApp" },
        { key: "trainingSetup", label: "Set-up" },
        { key: "classSchedule", label: "Online class" },
        {
          key: "status",
          label: "Status",
          render: (item) => <StatusBadge status={item.status} />,
        },
      ]}
    />
  );
}
