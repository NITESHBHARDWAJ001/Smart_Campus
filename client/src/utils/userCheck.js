import axios from 'axios';

/**
 * Check if a roll number is already in use
 * @param {string} rollNumber - The roll number to check
 * @returns {Promise<{exists: boolean, message: string}>}
 */
export const checkRollNumber = async (rollNumber) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/check?type=roll&value=${rollNumber}`);
    return { exists: res.data.exists, message: res.data.message };
  } catch (error) {
    console.error('Error checking roll number:', error);
    return { exists: false, error: 'Error checking availability' };
  }
};

/**
 * Check if a teacher ID is already in use
 * @param {string} teacherId - The teacher ID to check
 * @returns {Promise<{exists: boolean, message: string}>}
 */
export const checkTeacherId = async (teacherId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/check?type=teacher&value=${teacherId}`);
    return { exists: res.data.exists, message: res.data.message };
  } catch (error) {
    console.error('Error checking teacher ID:', error);
    return { exists: false, error: 'Error checking availability' };
  }
};

/**
 * Check if an email is already in use
 * @param {string} email - The email to check
 * @returns {Promise<{exists: boolean, message: string}>}
 */
export const checkEmail = async (email) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/check?type=email&value=${email}`);
    return { exists: res.data.exists, message: res.data.message };
  } catch (error) {
    console.error('Error checking email:', error);
    return { exists: false, error: 'Error checking availability' };
  }
};