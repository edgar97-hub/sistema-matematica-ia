"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UnstyledButton,
  Group,
  Text,
  Collapse,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import type { NavLinkItem } from "../../config/admin-menu-items"; // Ajusta la ruta
import classes from "./AppNavItem.module.css"; // Crearemos este archivo CSS

interface AppNavItemProps {
  item: NavLinkItem;
  isSubItem?: boolean;
  onLinkClick?: () => void; // Para cerrar el navbar móvil
}

export function AppNavItem({
  item,
  isSubItem = false,
  onLinkClick,
}: AppNavItemProps) {
  const pathname = usePathname();
  // Un submenú está "activo" si la ruta actual comienza con la ruta de alguno de sus hijos
  const isParentOfActiveRoute = () =>
    item.subItems?.some((sub) => sub.href && pathname.startsWith(sub.href)) ||
    false;

  // El estado 'opened' se inicializa basado en si es padre de la ruta activa
  const [opened, setOpened] = useState(isParentOfActiveRoute());

  // Efecto para actualizar 'opened' si la ruta cambia y este ítem es padre
  useEffect(() => {
    setOpened(isParentOfActiveRoute());
  }, [pathname, item.subItems]); // Re-ejecutar si cambia la ruta o los subítems

  const hasSubItems = item.subItems && item.subItems.length > 0;

  const handleItemClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault(); // Prevenir navegación si es un agrupador con submenús
      setOpened((o) => !o);
    } else if (item.href && onLinkClick) {
      onLinkClick();
    }
    // Si es un enlace simple sin subítems, Link se encarga de la navegación
  };

  const isActive = item.href && pathname === item.href;
  const ItemIcon = item.icon; // Componente de icono

  // Contenido visual del ítem (icono y label)
  const itemContent = (
    <Group wrap="nowrap" gap="xs" className={classes.linkContent}>
      <ThemeIcon
        variant={isActive || (opened && hasSubItems) ? "light" : "transparent"} // Resaltar si está activo o abierto con hijos
        color={isActive || (opened && hasSubItems) ? "blue" : "gray"} // Ajusta colores
        size={30}
      >
        <ItemIcon size={18} stroke={1.5} />
      </ThemeIcon>
      <Text size="sm" fw={isActive ? 600 : 400} className={classes.linkLabel}>
        {item.label}
      </Text>
      {hasSubItems && ( // Mostrar indicador solo si hay subítems
        <Box
          component={opened ? IconChevronDown : IconChevronRight}
          ml="auto"
          size={16}
          stroke={1.5}
          className={classes.chevron}
        />
      )}
    </Group>
  );

  // Si el ítem tiene una ruta definida, se usa Link, incluso si tiene subítems (el click maneja el despliegue)
  if (item.href) {
    return (
      <>
        <UnstyledButton
          component={Link}
          href={item.href}
          onClick={handleItemClick}
          className={`${classes.navLink} ${isActive ? classes.active : ""} ${
            isSubItem ? classes.subItem : ""
          }`}
        >
          {itemContent}
        </UnstyledButton>
        {hasSubItems && (
          <Collapse in={opened} transitionDuration={200}>
            <div className={classes.subItemsContainer}>
              {item.subItems?.map((subItem) => (
                <AppNavItem
                  key={subItem.label}
                  item={subItem}
                  isSubItem={true}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          </Collapse>
        )}
      </>
    );
  }

  // Si no tiene href pero sí subItems (es un agrupador puro)
  if (hasSubItems) {
    return (
      <>
        <UnstyledButton
          onClick={handleItemClick}
          className={`${classes.navControl} ${
            isParentOfActiveRoute() || opened ? classes.activeParent : ""
          }`}
        >
          {itemContent}
        </UnstyledButton>
        <Collapse in={opened} transitionDuration={200}>
          <div className={classes.subItemsContainer}>
            {item.subItems?.map((subItem) => (
              <AppNavItem
                key={subItem.label}
                item={subItem}
                isSubItem={true}
                onLinkClick={onLinkClick}
              />
            ))}
          </div>
        </Collapse>
      </>
    );
  }

  // Ítem simple sin ruta y sin subítems (raro, pero por si acaso)
  return (
    <UnstyledButton className={classes.navLink} disabled>
      {itemContent}
    </UnstyledButton>
  );
}
