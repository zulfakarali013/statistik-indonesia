// Figures from three more international publishers, read from their public APIs on 26 November 2026:
// WHO Global Health Observatory (ghoapi.azureedge.net), UN Statistics Division SDG database
// (unstats.un.org/SDGAPI) and ILOSTAT (rplumber.ilo.org). Each series is [first year, [one value a year]].

export const intl = {
  // WHO GHO WHOSIS_000002, both sexes
  hale: [2000, [59.0,59.3,59.4,59.6,58.3,60.1,60.3,60.5,60.8,61.0,61.2,61.5,61.7,61.9,62.2,62.4,62.6,62.9,63.1,63.4,62.3,58.9,62.4,63.7]],
  // UN SDG SH_STA_STNT, children under 5, both sexes (UNICEF/WHO/World Bank joint estimates)
  stunt: [2000, [39.8,39.6,39.6,39.6,39.6,39.6,39.6,39.3,38.7,38,37,35.8,34.6,33.5,32.2,31,29.8,28.5,27.3,26.1,25.1,24.3,23.7,23.1,22.6]],
  // UN SDG SH_STA_MORT, maternal deaths per 100,000 live births (UN inter-agency estimates)
  mmr: [2000, [311,300,283,279,283,268,264,257,251,246,242,230,220,208,198,190,182,173,168,161,184,226,148,140]],
  // UN SDG SH_H2O_SAFE, whole country (WHO/UNICEF Joint Monitoring Programme)
  water: [2000, [23.5,23.9,24.2,24.5,24.9,25.2,25.5,25.9,26.2,26.5,26.8,27.1,27.4,27.7,28.0,28.3,28.6,28.9,29.2,29.5,29.8,30.1,30.3,30.4,30.5]],
  // ILOSTAT UNE_DEAP_SEX_AGE_RT_A, ages 15 to 24, from BPS's labour force survey (Sakernas)
  youth: [2000, [19.9,19.9,22.4,22.1,24.4,26.2,24.5,22.6,19.5,18.9,17.6,18.4,15.5,15.7,15.7,17.0,15.8,14.5,16.3,13.6,14.8,13.9,14.1,13.3,15.2]],
};

// Second readings of figures the World Bank also prints, used only for the "Sources differ" checks.
export const checks = {
  life: { who: 'WHO GHO WHOSIS_000001', series: [2000, [67.4,67.6,67.7,67.9,66.4,68.4,68.7,68.9,69.1,69.3,69.5,69.8,70.1,70.3,70.6,70.8,71.1,71.4,71.6,72.0,70.9,66.4,71.0,72.7]],
    why: 'WHO\u2019s life tables and the UN estimates the World Bank uses are built separately; WHO counts the 2021 COVID-19 wave more heavily.' },
  unemp: { who: 'ILOSTAT survey, ages 15+', series: [2000, [6.08,6.08,6.6,6.66,7.3,7.95,7.55,8.06,7.21,6.11,5.61,5.15,4.47,4.34,4.05,4.51,4.3,3.78,4.39,3.59,4.25,3.83,3.46,3.42,3.85]],
    why: 'ILOSTAT prints the Sakernas survey result; the World Bank prints the ILO\u2019s modelled estimate.' },
  lfpr: { who: 'ILOSTAT survey, ages 15+', series: [2000, [67.8,67.1,66.0,65.7,65.7,64.4,64.2,66.2,66.4,66.0,66.6,66.9,67.4,66.8,66.6,66.6,66.3,66.7,67.7,68.2,67.4,65.9,67.0,67.3,69.4]],
    why: 'Survey result against the ILO\u2019s modelled estimate.' },
};
