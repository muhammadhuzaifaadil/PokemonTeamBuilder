import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  isInput?: boolean;
  defaultValue?: string;
  onClose: () => void;
  onConfirm: (value?: string) => void;
}

export default function ConfirmDialog({ open, title, message, isInput, defaultValue = "", onClose, onConfirm }: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {isInput ? (
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : (
          <Typography>{message}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onConfirm(inputValue)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
