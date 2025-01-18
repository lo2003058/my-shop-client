/**
 * Checks if the key press is allowed for phone number inputs (E.164 style),
 * enforcing a maximum length of 15 characters.
 * @param e A React KeyboardEvent
 */
export function handlePhoneNumberKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
) {
  // Allowed special keys:
  const allowedKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Delete",
  ];

  // If it's one of the allowed special keys, let it pass
  if (allowedKeys.includes(e.key)) return;

  const currentValue = e.currentTarget.value;

  // Allow "+" if the field is empty or caret is at the start
  if (
    e.key === "+" &&
    (currentValue.length === 0 || e.currentTarget.selectionStart === 0)
  ) {
    return;
  }

  // If it's a digit, enforce max length of 15
  if (/^\d$/.test(e.key)) {
    if (currentValue.length >= 15) {
      e.preventDefault();
      return;
    }
    return;
  }

  // For any other key, prevent input
  e.preventDefault();
}
