# Projekt: E-Commerce Platform Relaunch

## Kontext

Ein mittelständischer Händler mit 50M€ Jahresumsatz kämpfte mit einer Legacy-Plattform: 8 Sekunden Ladezeit, 40% Mobile-Abbruchrate, keine Möglichkeit für schnelle Feature-Releases.

## Meine Rolle

**Technical Lead** eines 6-köpfigen Teams, verantwortlich für Architektur-Entscheidungen und Stakeholder-Kommunikation.

## Die Herausforderung

- 15 Jahre gewachsenes Monolith-System
- Keine Tests, keine Dokumentation
- Business konnte 3 Monate keinen Umsatzausfall tolerieren
- Team hatte keine Erfahrung mit modernen Architekturen

## Mein Ansatz

**Strangler Fig Pattern statt Big Bang:**
Parallel-Betrieb beider Systeme, schrittweise Migration. Das war konträr zur Management-Erwartung eines schnellen Cuts, aber der einzig realistische Weg.

**Fokus auf Metriken, nicht Features:**
Zuerst Monitoring aufgebaut, dann optimiert. Ohne Baseline keine Verbesserung messbar.

**Team-Enablement:**
Pair Programming und Architecture Decision Records (ADRs) statt "Architekt entscheidet allein".

## Entscheidungen & Trade-offs

| Entscheidung | Alternative | Warum so? |
|--------------|-------------|-----------|
| Vue.js statt React | React hatte mehr Entwickler am Markt | Team-Expertise, schnellere Onboarding |
| Eigenes Design System | Fertige UI-Library | Langfristige Wartbarkeit, Brand-Konsistenz |
| PostgreSQL behalten | Wechsel zu NoSQL | Transaktionssicherheit für Bestellungen kritisch |

## Ergebnis

- **Ladezeit:** 8s → 1.2s
- **Mobile Conversion:** +35%
- **Deployment-Frequenz:** Monatlich → Täglich
- **Team-Zufriedenheit:** Deutlich gestiegen (Fluktuation von 30% auf 5%)

## Was ich gelernt habe

Der technisch "richtige" Weg ist nicht immer der beste. Die Migration hätte mit Microservices "sauberer" sein können, aber der pragmatische Modular-Monolith-Ansatz war für dieses Team und diese Timeline die bessere Wahl.
