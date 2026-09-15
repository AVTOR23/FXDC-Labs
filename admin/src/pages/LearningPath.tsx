import ApplicationManager, { StatusBadge } from "@/pages/ApplicationManager";

export default function LearningPath() {
  return (
    <ApplicationManager
      title="Learning path applications"
      endpoint="/api/admin/learning-path-applications"
      columns={[
        { key: "name", label: "Name" },
        { key: "username", label: "Username" },
        { key: "telegram", label: "Telegram" },
        { key: "trainingSetup", label: "Set-up" },
        { key: "classSchedule", label: "Schedule" },
        {
          key: "status",
          label: "Status",
          render: (item) => <StatusBadge status={item.status} />,
        },
      ]}
    />
  );
}
