const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class AzureService {
  async getStatus() {
    try {
      const { stdout } = await execAsync('az account show');
      return {
        isConnected: true,
        account: JSON.parse(stdout)
      };
    } catch (error) {
      return {
        isConnected: false,
        error: 'Not logged in to Azure CLI'
      };
    }
  }

  async login() {
    try {
      await execAsync('az login');
      return {
        success: true,
        message: 'Successfully logged in to Azure CLI'
      };
    } catch (error) {
      throw new Error('Failed to login to Azure CLI: ' + error.message);
    }
  }

  async logout() {
    try {
      await execAsync('az logout');
      return {
        success: true,
        message: 'Successfully logged out from Azure CLI'
      };
    } catch (error) {
      throw new Error('Failed to logout from Azure CLI: ' + error.message);
    }
  }
}

module.exports = new AzureService();
