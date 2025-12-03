"use client";

import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "blue",

  colors: {
    success: [
      "#E8F5E9",
      "#C8E6C9",
      "#A5D6A7",
      "#81C784",
      "#66BB6A",
      "#4CAF50",
      "#43A047",
      "#388E3C",
      "#2E7D32",
      "#1B5E20",
    ],

    warning: [
      "#FFF3E0",
      "#FFE0B2",
      "#FFCC80",
      "#FFB74D",
      "#FFA726",
      "#FF9800",
      "#FB8C00",
      "#F57C00",
      "#EF6C00",
      "#E65100",
    ],
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  components: {
    Button: {
      defaultProps: {
        size: "sm",
        radius: "sm",
      },
    },
    Modal: {
      defaultProps: {
        padding: "md",
        radius: "md",
      },
    },
  },
});
