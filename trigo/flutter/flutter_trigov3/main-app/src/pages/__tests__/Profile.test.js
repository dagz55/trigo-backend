import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDoc } from 'firebase/firestore';
import React from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import Profile from '../Profile';

// Mock the modules
jest.mock('../../contexts/AuthContext');
jest.mock('firebase/firestore');
jest.mock('react-toastify');

describe('Profile Component', () => {
  const mockCurrentUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
  };

  const mockProfileData = {
    name: 'Test User',
    phone: '1234567890',
    preferredPayment: 'cash',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  };

  beforeEach(() => {
    // Mock useAuth hook
    useAuth.mockReturnValue({
      currentUser: mockCurrentUser,
      updateUserProfile: jest.fn(),
    });

    // Mock Firestore getDoc
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockProfileData,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Profile />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loads and displays user profile data', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfileData.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockProfileData.phone)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockCurrentUser.email)).toBeInTheDocument();
    });
  });

  it('handles input changes correctly', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfileData.name)).toBeInTheDocument();
    });

    const nameInput = screen.getByDisplayValue(mockProfileData.name);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });

    expect(nameInput.value).toBe('New Name');
  });

  it('handles form submission successfully', async () => {
    const mockUpdateUserProfile = jest.fn().mockResolvedValue();
    useAuth.mockReturnValue({
      currentUser: mockCurrentUser,
      updateUserProfile: mockUpdateUserProfile,
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfileData.name)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    });
  });

  it('handles form submission error', async () => {
    const mockError = new Error('Update failed');
    const mockUpdateUserProfile = jest.fn().mockRejectedValue(mockError);
    useAuth.mockReturnValue({
      currentUser: mockCurrentUser,
      updateUserProfile: mockUpdateUserProfile,
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProfileData.name)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUserProfile).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
    });
  });

  it('handles notification preference changes', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument();
    });

    const emailCheckbox = screen.getByLabelText(/email notifications/i);
    const pushCheckbox = screen.getByLabelText(/push notifications/i);
    const smsCheckbox = screen.getByLabelText(/sms notifications/i);

    expect(emailCheckbox).toBeChecked();
    expect(pushCheckbox).toBeChecked();
    expect(smsCheckbox).not.toBeChecked();

    fireEvent.click(emailCheckbox);
    expect(emailCheckbox).not.toBeChecked();
  });

  it('disables email input field', async () => {
    render(<Profile />);

    await waitFor(() => {
      const emailInput = screen.getByDisplayValue(mockCurrentUser.email);
      expect(emailInput).toBeDisabled();
    });
  });
}); 