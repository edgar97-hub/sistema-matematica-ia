import { Badge } from "@mantine/core";
import {
  IconPlayerPlay,
  IconClock,
  IconCircleCheck,
  IconAlertCircle,
  IconProgress,
} from "@tabler/icons-react";
import { OrderPipelineStatus } from "../../../types/order.types"; // Asume que tienes este enum en tus tipos

interface OrderStatusBadgeProps {
  status: OrderPipelineStatus;
}

const statusConfig = {
  [OrderPipelineStatus.COMPLETED]: {
    label: "Completado",
    color: "green",
    icon: <IconCircleCheck size={14} />,
  },
  [OrderPipelineStatus.FAILED_GENERAL]: {
    label: "Error",
    color: "red",
    icon: <IconAlertCircle size={14} />,
  },
  [OrderPipelineStatus.OCR_FAILED]: {
    label: "Error de Lectura",
    color: "red",
    icon: <IconAlertCircle size={14} />,
  },
//   [OrderPipelineStatus.CREDIT_DEDUCTION_FAILED]: {
//     label: "Error de Crédito",
//     color: "red",
//     icon: <IconAlertCircle size={14} />,
//   },
//   [OrderPipelineStatus.AI_SOLUTION_FAILED]: {
//     label: "Error de IA",
//     color: "red",
//     icon: <IconAlertCircle size={14} />,
//   },
  // ... puedes añadir más estados de error específicos
  DEFAULT: {
    label: "Procesando",
    color: "blue",
    icon: <IconProgress size={14} />,
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.DEFAULT;

  return (
    <Badge color={config.color} variant="light" leftSection={config.icon}>
      {config.label}
    </Badge>
  );
}
