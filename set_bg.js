const fs = require('fs');
const path = require('path');

const components = [
  { name: 'RequiredDocumentsSection.jsx', bg: 'bg-brand-surface' },
  { name: 'WinnerBenefitsSection.jsx', bg: 'bg-white' },
  { name: 'SponsorshipSection.jsx', bg: 'bg-brand-surface' },
  { name: 'GeneralSponsorshipSection.jsx', bg: 'bg-white' },
  { name: 'DelegateRegistrationSection.jsx', bg: 'bg-brand-surface' },
  { name: 'AwardsSection.jsx', bg: 'bg-white' },
  { name: 'RegistrationFlowSection.jsx', bg: 'bg-brand-surface' },
  { name: 'PastEditionsSection.jsx', bg: 'bg-white' },
  { name: 'TestimonialsSection.jsx', bg: 'bg-brand-surface' },
  { name: 'CompanyMarquee.jsx', bg: 'bg-white' },
  { name: 'EcosystemPartnersSection.jsx', bg: 'bg-brand-surface' },
  { name: 'OrganiserSection.jsx', bg: 'bg-white' },
  { name: 'FaqSection.jsx', bg: 'bg-brand-surface' },
  { name: 'NewsletterSection.jsx', bg: 'bg-white' },
  { name: 'ContactSection.jsx', bg: 'bg-brand-surface' }
];

const dir = 'c:/Users/Asus/Desktop/Snail-integral/Brand-r-com-4/src/components';

components.forEach(comp => {
  const filePath = path.join(dir, comp.name);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipped: ${comp.name} not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the first <section className="...">
  const sectionRegex = /<section\s+[^>]*className=["']([^"']*)["'][^>]*>/;
  const match = content.match(sectionRegex);
  
  if (match) {
    let oldClass = match[1];
    let newClass = oldClass.replace(/\bbg-(white|brand-surface)\b/g, '').replace(/\s+/g, ' ').trim();
    newClass = newClass + ' ' + comp.bg;
    
    const newContent = content.replace(sectionRegex, (fullMatch) => {
      return fullMatch.replace(oldClass, newClass);
    });
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${comp.name} -> ${comp.bg}`);
  } else {
    console.log(`No section found in: ${comp.name}`);
  }
});
