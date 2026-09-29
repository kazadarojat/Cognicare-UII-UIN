<img width="1672" height="941" alt="image" src="https://github.com/user-attachments/assets/4e442615-085e-4a83-8ea2-92719a419e89" />

# 🧠 Cognicare

### Multimodal Cognitive Health Monitoring Platform

**Cognicare** adalah platform digital untuk **skrining risiko gangguan kognitif dan pemantauan kesehatan kognitif secara longitudinal** dengan menggabungkan data klinis, faktor risiko, pola tidur, serta digital speech biomarkers.

> **Cognicare is designed as a screening and monitoring support tool, not as a diagnostic system.**

---

## 🌱 Overview

Gangguan kognitif, termasuk Alzheimer’s disease, berkembang secara progresif dan sering kali baru teridentifikasi ketika perubahan kognitif sudah cukup bermakna.

Cognicare dikembangkan untuk membantu membangun proses monitoring yang:

* 🧠 berorientasi pada kesehatan kognitif
* 📊 berbasis data
* 🎙️ memanfaatkan digital biomarkers
* 📈 mendukung pemantauan longitudinal
* 👨‍⚕️ dapat memberikan ringkasan untuk tenaga kesehatan
* 📱 dapat digunakan melalui perangkat digital
* 🔐 mengutamakan privacy dan data minimization

Cognicare mengintegrasikan beberapa sumber informasi dalam satu alur assessment:

```text
                    COGNICARE
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
   Clinical Data   Behavioral Data   Digital Biomarkers
        │               │                │
        │          ┌────┴────┐           │
        │          │         │           │
        ▼          ▼         ▼           ▼
      AD8       Sleep    Risk Factors  Speech
        │          │         │           │
        └──────────┴─────────┴───────────┘
                        │
                        ▼
                 Risk Assessment
                        │
                        ▼
             Longitudinal Monitoring
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
          Patient      Doctor     Kader
          Dashboard    Summary     Mode
```

---

# 🎯 Objectives

Cognicare dikembangkan dengan beberapa tujuan utama:

1. Membantu melakukan **cognitive risk screening** secara digital.
2. Mengintegrasikan berbagai faktor yang relevan terhadap kesehatan kognitif.
3. Mengembangkan penggunaan **digital speech biomarkers** sebagai sumber informasi tambahan.
4. Memungkinkan **longitudinal monitoring** sehingga perubahan dari waktu ke waktu dapat diamati.
5. Menyediakan informasi yang lebih terstruktur untuk pasien, kader, maupun tenaga kesehatan.
6. Menjadi fondasi untuk pengembangan **multimodal AI-based cognitive health monitoring**.

---

# ✨ Core Features

## 🧠 Cognitive Assessment

Cognicare menyediakan assessment kognitif berbasis digital, termasuk:

* AD8-based cognitive screening
* subjective cognitive complaints
* informant-related information
* assessment history
* confidence-aware result interpretation

---

## ❤️ Cognitive Risk Factors

Platform mengumpulkan beberapa faktor yang dapat berhubungan dengan kesehatan kognitif, seperti:

* demographic information
* cardiovascular/metabolic risk factors
* lifestyle-related information
* sleep-related information
* other relevant contextual factors

---

## 😴 Sleep Assessment

Cognicare menyediakan modul assessment tidur sebagai salah satu komponen dalam cognitive health profile.

Data tidur dapat digunakan untuk:

* melihat pola tidur
* memberikan contextual information
* mendukung longitudinal monitoring
* menjadi salah satu fitur potensial dalam pengembangan multimodal model

---

## 🎙️ Digital Speech Biomarker

Cognicare memiliki modul analisis suara eksperimental.

Pipeline saat ini berfokus pada karakteristik temporal speech, terutama:

```text
Audio
  ↓
Frame extraction
  ↓
RMS / energy analysis
  ↓
Silence detection
  ↓
Pause extraction
  ↓
Speech features
```

Beberapa fitur yang dapat diekstraksi antara lain:

* pause count
* total pause duration
* pause ratio
* mean pause duration
* speech quality indicators

Audio diproses untuk menghasilkan fitur dan tidak dimaksudkan untuk menjadi diagnosis secara langsung.

### Future Speech Biomarkers

Pengembangan berikutnya dapat mencakup:

* speech rate
* articulation rate
* pitch
* jitter
* shimmer
* acoustic features
* lexical diversity
* semantic coherence
* hesitation patterns
* linguistic complexity

---

# 📊 Longitudinal Monitoring

Salah satu konsep utama Cognicare adalah bahwa kesehatan kognitif tidak seharusnya dilihat hanya dari satu assessment.

Cognicare menyimpan assessment berdasarkan waktu sehingga memungkinkan pola:

```text
Baseline
   │
   ▼
Assessment 01
   │
   ▼
Assessment 02
   │
   ▼
Assessment 03
   │
   ▼
Current Status
```

Dengan pendekatan longitudinal, pengembangan Cognicare diarahkan untuk mengidentifikasi:

* perubahan cognitive score
* perubahan speech characteristics
* perubahan behavioral factors
* perubahan risk profile
* trajectory dari waktu ke waktu

---

# ⚕️ Risk Assessment Engine

Cognicare saat ini menggunakan **rule-based risk engine** sebagai prototype decision-support layer.

A
