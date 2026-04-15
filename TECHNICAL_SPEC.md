# Technical Specification: AI Recommendation Engine

This document outlines the detailed architecture and ML logic behind the Movie.wine recommendation system.

## 1. AI Philosophy
The recommendation engine follows a **hybrid AI approach**:
* **Content-based ML** for personalization
* **Rule-based signals** for stability
* **Explainability** as a first-class feature

## 2. Movie Intelligence Layer (NLP Embeddings)
### 6.1 Problem Statement
Machines cannot understand movie descriptions directly.

### 6.2 Solution
Convert movie metadata into **numerical embeddings** using NLP.

### 6.3 Input Features
* Movie overview
* Genres
* Keywords
* Cast names (top billed)

### 6.4 Embedding Pipeline
```
TMDb Movie Text
     ↓
Text Preprocessing
     ↓
Sentence Transformer Model
     ↓
Vector Embedding
```
Each movie becomes a **semantic vector** representing its meaning.

## 3. User Preference Modeling
### 7.1 User Signals Collected
* Movie views
* Likes
* Watchlist additions
* Ratings (optional)

### 7.2 User Vector Construction
```
User Vector = Average(Embeddings of interacted movies)
```

## 4. Recommendation Algorithm
### 8.1 Hybrid Scoring Formula
```
Final Score =
  0.5 × Content Similarity
+ 0.3 × TMDb Rating
+ 0.2 × TMDb Popularity
```

## 5. Explainable AI Layer (XAI)
The system tracks top similarity contributors and maps features to human-readable text to generate explanations like:
* “Recommended because you liked Interstellar”
* “Strong match on Sci-Fi and Drama themes”

... (Full details imported from original README)
