# 📋 Nota sull'IVA per Prestazioni Sanitarie

## Normativa Italiana

Le prestazioni sanitarie rese da **medici, odontoiatri e altri operatori sanitari** sono **esenti IVA** ai sensi dell'**Art. 10, DPR 633/72**.

### Cosa significa

- **VAT_RATE = 0** (aliquota IVA 0%)
- Il prezzo della fattura **non include IVA**
- Se il paziente paga €50, riceve fattura per €50 (senza IVA aggiunta)

### Esempio

**Configurazione corretta per centro medico:**
```env
VAT_RATE=0
```

**Fattura generata:**
- Imponibile: €50,00
- IVA (0%): €0,00
- **Totale: €50,00**

---

## ⚠️ Quando usare IVA diversa da 0%

Se NON sei un operatore sanitario o offri servizi non sanitari:

### Altri casi d'uso (NON sanitari):

**Consulenze generiche (22%):**
```env
VAT_RATE=22
```

**Prestazioni ridotte (10%):**
```env
VAT_RATE=10
```

**Regime forfettario (NO IVA):**
```env
VAT_RATE=0
```

---

## 📚 Riferimenti Normativi

- **DPR 633/72, Art. 10** - Esenzioni IVA
- Prestazioni sanitarie: punto 18, 19, 20
- Include: medici, odontoiatri, psicologi, fisioterapisti, infermieri, ecc.

---

## ✅ Configurazione di Default

Il sistema è già configurato con **VAT_RATE=0** per prestazioni sanitarie.

Non modificare questo valore a meno che non sia necessario per la tua specifica attività.

---

## ⚠️ Disclaimer

Questa è un'informazione generale. Per questioni fiscali specifiche, **consulta sempre il tuo commercialista** per verificare il corretto regime IVA da applicare alla tua attività.
