# Anleitung zum Aufsetzen der Anwendung
Um die Anwendung lokal starten zu können, müssen folgende Informationen gegeben sein:

1. Lokale PostgreSQL Datenbank aufsetzen
2. ```tickety_dump.sql``` in die Datenbank laden
3. [Resend-Anwendung]("https://resend.com/") erstellen, um E-Mails versenden zu können.
4. [Clerk-Anwendung]("https://clerk.com/") erstellen, um die Nutzerauthentifizierung zu ermöglichen.
5. ```.env``` mit den Datenbankinformationen, Resend-API-Key und Clerk-Informationen befüllen.
6. ```npm run dev``` um die Anwendung lokal zu starten
