"use client";
import React, { useState, useEffect } from "react";
import { Box, Stack, TextField, Button, CircularProgress, Alert } from "@mui/material";
import { useTeams } from "@/context/TeamsContext";
import PokemonCard from "./PokemonCard";
import { Pokemon } from "@/types/pokemon";
import { fetchPokemon } from "@/api/pokemonApi";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { selectedTeamId } = useTeams();

  // Resetting search state when team changes 
  useEffect(() => {
    setPokemon(null);
    setError(null);
    setQ("");
  }, [selectedTeamId]);

  const onSearch = async () => {
    setError(null);
    setPokemon(null);
    if (!q.trim()) return setError("Enter a name");

    setLoading(true);
    try {
      const p = await fetchPokemon(q.toLowerCase().trim());
      if (!p) {
        setError("Not found");
      } else {
        setPokemon(p);
      }
    } catch (err) {
      setError("Not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          label="Search Pokémon by name"
          size="small"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={onSearch} disabled={loading}>
          Search
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {pokemon && !loading && (
        <Box sx={{ mt: 2 }}>
          <PokemonCard pokemon={pokemon} />
        </Box>
      )}
    </Box>
  );
}
