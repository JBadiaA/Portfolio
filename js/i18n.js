const TRANSLATIONS = {
  ca: {
    sobre_mi:           'SOBRE MI',
    projectes_personals:'PROJECTES PERSONALS',
    projectes_label:    'PROJECTES',
    altres_label:       'ALTRES',
    contacte_label:     'CONTACTE',
    back:               '← Tornar',
    close:              'Tancar',
    prev:               'Anterior',
    next:               'Següent',
    proces:             "PROCÉS D'EXPERIMENTACIÓ",
    about_bio: 'Pilar Minye Morlan (2002) graduada en Disseny amb menció en Disseny d\'Espais a la BAU, Centre Universitari d\'Art i Disseny de Barcelona. Li interessa el disseny d\'espais; buscar i localitzar la part emocional en múltiples tècniques per expressar l\'imaginari en el cos i les connexions. Es interessa en la il·lustració, la fotografia i la música.',
    scroll_hint:        'Desplaça per descobrir'
  },
  en: {
    sobre_mi:           'ABOUT ME',
    projectes_personals:'PERSONAL PROJECTS',
    projectes_label:    'PROJECTS',
    altres_label:       'OTHERS',
    contacte_label:     'CONTACT',
    back:               '← Back',
    close:              'Close',
    prev:               'Previous',
    next:               'Next',
    proces:             'PROCESS DOCUMENTATION',
    about_bio: 'Pilar Minye Morlan (2002), graduate in Design with a specialisation in Spatial Design at BAU, Centre Universitari d\'Art i Disseny de Barcelona. She is interested in spatial design — finding and locating the emotional dimension through multiple techniques to express the imaginary in body and connection. She is also drawn to illustration, photography and music.',
    scroll_hint:        'Scroll to discover'
  },
  es: {
    sobre_mi:           'SOBRE MI',
    projectes_personals:'PROYECTOS PERSONALES',
    projectes_label:    'PROYECTOS',
    altres_label:       'OTROS',
    contacte_label:     'CONTACTO',
    back:               '← Volver',
    close:              'Cerrar',
    prev:               'Anterior',
    next:               'Siguiente',
    proces:             'PROCESO DE EXPERIMENTACIÓN',
    about_bio: 'Pilar Minye Morlan (2002) graduada en Diseño con mención en Diseño de Espacios en la BAU, Centre Universitari d\'Art i Disseny de Barcelona. Le interesa el diseño de espacios; buscar y localizar la parte emocional en múltiples técnicas para expresar el imaginario en el cuerpo y las conexiones. Se interesa también en la ilustración, la fotografía y la música.',
    scroll_hint:        'Desplaza para descubrir'
  }
};

let currentLang = localStorage.getItem('lang') || 'ca';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || (TRANSLATIONS.ca[key])
    || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
}

function getLang() {
  return currentLang;
}
