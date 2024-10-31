import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const signIn = async () => {
  try {
    const { stdout, stderr } = await execAsync('az account show');
    if (stderr) {
      // Not logged in, try to login
      await execAsync('az login');
      return { success: true };
    }
    return { success: true, account: JSON.parse(stdout) };
  } catch (error) {
    console.error('Azure CLI error:', error);
    throw new Error('Failed to authenticate with Azure CLI');
  }
}

export const signOut = async () => {
  try {
    await execAsync('az logout');
    return { success: true };
  } catch (error) {
    console.error('Azure CLI logout error:', error);
    throw new Error('Failed to logout from Azure CLI');
  }
}

export const getSession = async () => {
  try {
    const { stdout } = await execAsync('az account show');
    return JSON.parse(stdout);
  } catch (error) {
    return null;
  }
}
