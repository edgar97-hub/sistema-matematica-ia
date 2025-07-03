"use client";

import {
  AppShell,
  Burger,
  Group,
  Text,
  Button,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useAuthStore } from "../../store/auth.store";
import { ThemeToggle } from "./ThemeToggle";
import { IconLogout, IconCoins } from "@tabler/icons-react";
import { adminMenuItems, NavLinkItem } from "../../config/admin-menu-items";
import { AppNavItem } from "./AppNavItem";

export function MainLayout({
  children,
  navItems,
}: {
  children: React.ReactNode;
  navItems: any;
}) {
  const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure(false);
  const user = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutAction();
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: { base: "100%", sm: 260, lg: 280 }, // Ancho base para móvil, luego se ajusta
        breakpoint: "sm", // Punto en el que el Navbar se oculta en escritorio y aparece el Burger
        collapsed: { mobile: !navbarOpened, desktop: false }, // Navbar no colapsado en desktop
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={navbarOpened}
            onClick={toggleNavbar}
            hiddenFrom="sm" // Ocultar Burger en pantallas sm y mayores
            size="sm"
          />
          {/* Logo o Título de la App */}
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link
              href="/admin/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Text size="lg" fw={700}>
                JN COURIER{" "}
                {/* <span style={{ fontWeight: 400, fontSize: "0.8em" }}>
                  Admin
                </span> */}
              </Text>
            </Link>
            <Group gap="xs">
              {user && (
                <>
                  <Text
                    size="xs"
                    c="dimmed"
                    display={{ base: "none", xs: "block" }}
                  >
                    {user.name || user.email} {user.role && `(${user.role})`}
                  </Text>
                  {/* Mostrar créditos solo para usuarios PWA (CLIENT) */}
                  {user.role === "CLIENT" && ( // Asume que UserPwaRole.CLIENT es 'CLIENT'
                    <Tooltip
                      label="Créditos Disponibles"
                      position="bottom"
                      withArrow
                    >
                      <Group
                        gap={4}
                        align="center"
                        style={{ cursor: "default" }}
                      >
                        <IconCoins
                          size={20}
                          stroke={1.5}
                          style={{ color: "var(--mantine-color-yellow-6)" }}
                        />
                        <Text size="sm" fw={600}>
                          {user.credits}
                        </Text>
                      </Group>
                    </Tooltip>
                  )}
                </>
              )}
              {/* <ThemeToggle /> */}
              {user && (
                <Button
                  onClick={handleLogout}
                  variant="light"
                  color="red"
                  size="xs"
                  leftSection={<IconLogout size={16} stroke={1.5} />}
                >
                  Salir
                </Button>
              )}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section
          grow
          component={ScrollArea}
          mx="-md"
          px="md"
          scrollbarSize={8}
          type="hover"
        >
          {navItems.map((item: any) => (
            <AppNavItem
              key={item.label}
              item={item}
              onLinkClick={() => {
                if (navbarOpened) {
                  toggleNavbar();
                }
              }}
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
