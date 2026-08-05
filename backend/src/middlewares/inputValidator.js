/**
 * Strict Input Validation Middleware for Public Registration Forms
 */

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 150;
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[+]?[0-9\s-]{7,20}$/;
  return phoneRegex.test(phone.trim());
};

const sanitizeString = (str, maxLen = 200) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen);
};

// Delegate registration input validator
const validateDelegateInput = (req, res, next) => {
  const { fullName, email, mobileNumber, organization, designation, city, stateCountry, pinCode, gstNumber } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.length > 150) {
    return res.status(400).json({ success: false, message: 'Please provide a valid full name (2-150 characters).' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!isValidPhone(mobileNumber)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid mobile phone number.' });
  }

  if (!organization || typeof organization !== 'string' || organization.trim().length < 1 || organization.length > 200) {
    return res.status(400).json({ success: false, message: 'Please provide a valid organization name.' });
  }

  if (!designation || typeof designation !== 'string' || designation.trim().length < 1 || designation.length > 150) {
    return res.status(400).json({ success: false, message: 'Please provide a valid designation.' });
  }

  // Trim and sanitize strings
  req.body.fullName = sanitizeString(fullName, 150);
  req.body.email = email.trim().toLowerCase();
  req.body.mobileNumber = mobileNumber.trim();
  req.body.organization = sanitizeString(organization, 200);
  req.body.designation = sanitizeString(designation, 150);
  if (city) req.body.city = sanitizeString(city, 100);
  if (stateCountry) req.body.stateCountry = sanitizeString(stateCountry, 100);
  if (pinCode) req.body.pinCode = sanitizeString(pinCode, 20);
  if (gstNumber) req.body.gstNumber = sanitizeString(gstNumber, 50).toUpperCase();

  next();
};

// Nomination input validator
const validateNominationInput = (req, res, next) => {
  const { fullName, email, mobileNumber, organization, designation, applicantType, awardCategory } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.length > 150) {
    return res.status(400).json({ success: false, message: 'Please provide a valid full name (2-150 characters).' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  if (!isValidPhone(mobileNumber)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid mobile phone number.' });
  }

  if (!awardCategory || typeof awardCategory !== 'string' || awardCategory.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Please select a valid award category.' });
  }

  if (applicantType && !['Individual', 'Organization'].includes(applicantType)) {
    return res.status(400).json({ success: false, message: 'Invalid applicant type.' });
  }

  req.body.fullName = sanitizeString(fullName, 150);
  req.body.email = email.trim().toLowerCase();
  req.body.mobileNumber = mobileNumber.trim();
  req.body.organization = sanitizeString(organization, 200);
  req.body.designation = sanitizeString(designation, 150);

  next();
};

module.exports = {
  validateDelegateInput,
  validateNominationInput,
  isValidEmail,
  isValidPhone,
};
