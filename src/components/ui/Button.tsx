import React from "react";
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { ButtonProps } from "../../types";

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
}) => {
  const getButtonStyle = () => {
    if (variant === "primary") return styles.primaryButton;
    if (variant === "outline") return styles.outlineButton;
    return styles.secondaryButton;
  };

  const getTextStyle = () => {
    if (variant === "primary") return styles.primaryText;
    if (variant === "outline") return styles.outlineText;
    return styles.secondaryText;
  };

  const getLoadingColor = () => {
    if (variant === "primary") return "#ffffff";
    if (variant === "secondary") return "#000000";
    return "#f99f12";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        loading && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            getTextStyle(),
            disabled && styles.disabledText,
          ]}
        >
          {icon && `${icon} `}{title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#f99f12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: "#f99f12",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#f99f12",
  },
  disabledButton: {
    backgroundColor: "#666666",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  primaryText: {
    color: "#ffffff",
  },
  secondaryText: {
    color: "#000000",
  },
  outlineText: {
    color: "#f99f12",
  },
  disabledText: {
    color: "#999999",
  },
});