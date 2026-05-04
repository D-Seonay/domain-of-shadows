# Spécification : Système de Portails (Gate System)
**Date :** 2026-05-04
**Statut :** En cours de révision par l'utilisateur

## 1. Vue d'ensemble
Le système de Portails transforme la progression du jeu d'un flux linéaire en une série de missions tactiques ("Raids"). Le joueur utilise un scanner pour localiser des instabilités dimensionnelles, choisit sa cible, et entre dans un donjon pour vaincre un Boss et extraire son ombre.

## 2. Le Scanner Radar
- **Interface :** Une vue radar circulaire avec un balayage animé.
- **Action "Scan" :** Coûte de la Shadow Energy. Révèle 3 à 5 portails aléatoires.
- **Action "Re-scan" :** Permet de régénérer les portails contre des ressources.
- **Portails :**
    - **Rangs :** E, D, C, B, A, S (déterminent la difficulté et les récompenses).
    - **Instabilité :** Compte à rebours avant fermeture automatique du portail.
    - **Aperçu :** Affiche le type de monstres, le Boss et les récompenses potentielles.

## 3. Mécanique de Raid (Dungeon Loop)
- **Structure :** 
    1. **Phase de Nettoyage :** Tuer un quota de monstres de base.
    2. **Phase de Boss :** Combat contre un ennemi unique avec des mécaniques spéciales (ex: Shields).
- **Affixes Aléatoires (Difficulté Mixte) :** Chaque raid possède des modificateurs (ex: +20% HP ennemis, -10% CD compétences).
- **Compagnons :** Les ombres de l'armée du joueur apparaissent et attaquent automatiquement durant le raid.

## 4. Extraction & Butin
- **Succès :** Ouverture de l'interface "ARISE" après la défaite du Boss. Gain d'Or, d'Exp et de Cœurs de Donjon.
- **Échec :** (Mort ou Temps écoulé) Expulsion du portail, perte de l'énergie de scan et application d'un "Malus de Fatigue" (réduction temporaire de stats).

## 5. Architecture Technique
- **Nouveau Hook :** `usePortalScanner.ts` pour gérer l'état du radar et la génération des portails.
- **Composant UI :** `PortalRadar.tsx` (Canvas ou Framer Motion pour le sweep).
- **Modèle de Données :** Extension de `Enemy` pour inclure les affixes et le type de portail.

## Auto-Revue (Self-Review)
1. **Placeholders :** Aucun "TBD". Les coûts en énergie seront équilibrés durant le développement.
2. **Consistance :** Le système de fatigue est cohérent avec l'esthétique "Solo Leveling".
3. **Portée :** Décomposition nécessaire : 1. Radar UI, 2. Logique de génération, 3. Transition de Raid.
4. **Ambiguïté :** Clarifié que le jeu idle "s'arrête" durant un raid (Option A).
