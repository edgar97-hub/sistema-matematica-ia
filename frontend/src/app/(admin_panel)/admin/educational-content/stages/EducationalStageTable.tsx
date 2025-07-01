"use client";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  Badge,
  Center,
  Loader,
  Box,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { EducationalStageFE } from "../../../../../types/educational-content.types";
import classes from "./EducationalStageTable.module.css";

export interface EducationalStageTableProps {
  stages: EducationalStageFE[];
  isLoading: boolean;
  onEdit: (stage: EducationalStageFE) => void;
  onDelete: (stage: EducationalStageFE) => void;
}

export function EducationalStageTable({
  stages,
  isLoading,
  onEdit,
  onDelete,
}: EducationalStageTableProps) {
  const rows = stages.map((stage) => (
    <Table.Tr key={stage.id} className={classes.dataRow}>
      <Table.Td>{stage.name}</Table.Td>
      {/* <Table.Td className={classes.descriptionCell}>
        {stage.description || "-"}
      </Table.Td> */}
      {/* <Table.Td style={{ textAlign: "center" }}>
        {stage.country?.name || stage.countryId || "N/A"}
      </Table.Td> */}
      {/* <Table.Td style={{ textAlign: "center" }}>{stage.displayOrder}</Table.Td> */}
      {/* <Table.Td style={{ textAlign: "center" }}>
        <Badge
          color={stage.isActive ? "green" : "red"}
          variant="light"
          leftSection={
            stage.isActive ? (
              <IconCircleCheck size={14} />
            ) : (
              <IconCircleX size={14} />
            )
          }
        >
          {stage.isActive ? "Activa" : "Inactiva"}
        </Badge>
      </Table.Td> */}
      <Table.Td style={{ textAlign: "center" }}>
        <Group gap="xs" justify="center" wrap="nowrap">
          <Tooltip label="Editar Etapa">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => onEdit(stage)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Eliminar Etapa">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => onDelete(stage)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Box className={classes.tableWrapper}>
      <Table
        striped
        highlightOnHover
        withColumnBorders
        verticalSpacing="sm"
        miw={700}
      >
        <Table.Thead className={classes.tableHeader}>
          <Table.Tr>
            <Table.Th>Nombre de la Etapa</Table.Th>
            {/* <Table.Th>Descripción</Table.Th> */}
            {/* <Table.Th style={{ textAlign: "center" }}>País</Table.Th> */}
            {/* <Table.Th style={{ textAlign: "center", width: "100px" }}>
              Orden
            </Table.Th> */}
            {/* <Table.Th style={{ textAlign: "center", width: "120px" }}>
              Estado
            </Table.Th> */}
            <Table.Th style={{ textAlign: "center", width: "100px" }}>
              Acciones
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!isLoading && stages.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Center p="xl">
                  <Text c="dimmed">No hay etapas educativas definidas.</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          )}
          {!isLoading && stages.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
