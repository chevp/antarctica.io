# Projekt: Real-Time Analytics Dashboard

## Kontext

Ein FinTech-Startup brauchte Echtzeit-Einblicke in Transaktionsdaten. Bestehende Lösung: Excel-Reports, einmal pro Woche manuell erstellt. Entscheidungen basierten auf veralteten Daten.

## Meine Rolle

**Sole Developer** in der ersten Phase, später **Tech Lead** mit 2 Junior-Entwicklern.

## Die Herausforderung

- 500.000 Transaktionen täglich
- Latenz unter 500ms für Dashboard-Updates
- Budget: Minimal (Startup-Phase)
- Compliance: Finanzdaten dürfen bestimmte Regionen nicht verlassen

## Mein Ansatz

**Prototyp zuerst:**
Innerhalb von 2 Wochen funktionierender Prototyp mit echten Daten. Nicht perfekt, aber demonstrierte den Wert für Stakeholder.

**Event-Driven von Anfang an:**
Keine REST-Polling-Architektur, sondern WebSocket + Event-Sourcing. Höherer initialer Aufwand, aber skaliert ohne Redesign.

**Junior-Entwickler als Asset:**
Frische Perspektiven genutzt. Ein Junior fragte: "Warum cachen wir das nicht einfach?" – führte zur Redis-Integration, die 80% der DB-Last eliminierte.

## Technische Entscheidungen

**Warum nicht Kafka?**
Overkill für die Datenmenge. RabbitMQ mit Dead-Letter-Queues war ausreichend und das Team kannte es bereits.

**Warum eigenes Dashboard statt Grafana?**
Business wollte Embedded-Lösung für Kunden. Grafana hätte zusätzliche Lizenzkosten und Branding-Probleme bedeutet.

## Ergebnis

- **Time-to-Insight:** 1 Woche → Sekunden
- **Kosten:** 200€/Monat Cloud-Infrastruktur
- **Adoption:** 95% der Mitarbeiter nutzen das Dashboard täglich
- **Weiterentwicklung:** System läuft seit 3 Jahren stabil, nur minimale Wartung

## Was ich gelernt habe

Juniors sind keine "billigen Arbeitskräfte", sondern bringen wertvolle Perspektiven. Meine Aufgabe als Lead: Rahmen schaffen, in dem ihre Fragen gehört werden.
