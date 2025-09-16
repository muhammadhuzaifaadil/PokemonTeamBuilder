import { useState } from "react";
import { Card, CardContent, CardMedia, Stack, Typography, Chip, Button, Snackbar, Alert, Slide } from "@mui/material";
import { useTeams } from "@/context/TeamsContext";
import { Pokemon } from "@/types/pokemon";

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { addPokemon, removePokemon, teams, selectedTeamId } = useTeams();
  const current = teams.find((t) => t.id === selectedTeamId);
  const isInTeam = current?.pokemons.some((p) => p.id === pokemon.id) ?? false;

  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success" | "error"}>({open: false, message: "", severity: "success"});

  const onAdd = () => {
    const res = addPokemon(pokemon);
    if (!res.ok) {
      setSnackbar({ open: true, message: res.reason === "full" ? "Team is full!" : "Already in team!", severity: "error" });
    } else {
      setSnackbar({ open: true, message: "Added to team!", severity: "success" });
    }
  };

  const onRemove = () => {
    removePokemon(pokemon.id);
    setSnackbar({ open: true, message: "Removed from team", severity: "success" });
  };

  return (
    <>
      <Card sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 4 }}>
        {pokemon.image && <CardMedia component="img" height="250" image={pokemon.image} alt={pokemon.name} />}
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ textTransform: "uppercase", textAlign: "center", flex: 1 }}>
              {pokemon.name}
            </Typography>
            <Typography variant="body2">XP: {pokemon.baseExperience}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {pokemon.types.map((t) => <Chip key={t} label={t} size="medium" />)}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5 }}
            onClick={() => (isInTeam ? onRemove() : onAdd())}
          >
            {isInTeam ? "Remove from team" : "Add to team"}
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
