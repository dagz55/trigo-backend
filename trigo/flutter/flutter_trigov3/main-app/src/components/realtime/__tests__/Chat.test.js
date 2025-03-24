import { act, fireEvent, render, screen } from '@testing-library/react';
import { getDatabase, off, onValue, push, ref } from 'firebase/database';
import React from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';
import Chat from '../Chat';

// Mock Firebase Realtime Database
jest.mock('firebase/database');

// Mock react-toastify
jest.mock('react-toastify');

// Mock AuthContext
jest.mock('../../../contexts/AuthContext');

describe('Chat Component', () => {
  const mockUser = {
    uid: 'test-user-123',
    displayName: 'Test User',
  };

  const mockMessages = [
    {
      id: 'msg1',
      text: 'Hello',
      senderId: 'test-user-123',
      senderName: 'Test User',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'msg2',
      text: 'Hi there',
      senderId: 'driver-123',
      senderName: 'Test Driver',
      timestamp: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth
    useAuth.mockReturnValue({ currentUser: mockUser });

    // Mock Firebase methods
    getDatabase.mockReturnValue({});
    ref.mockReturnValue({});
    push.mockResolvedValue({ key: 'new-message-id' });
  });

  it('renders loading state initially', () => {
    render(<Chat rideId="test-ride-123" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays messages when they are loaded', async () => {
    // Mock onValue to return messages
    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => mockMessages,
      });
      return jest.fn();
    });

    await act(async () => {
      render(<Chat rideId="test-ride-123" />);
    });

    // Verify messages are displayed
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });

  it('sends a new message when form is submitted', async () => {
    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => mockMessages,
      });
      return jest.fn();
    });

    await act(async () => {
      render(<Chat rideId="test-ride-123" />);
    });

    // Type a new message
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'New message' } });

    // Submit the form
    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Verify message was sent
    expect(push).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        text: 'New message',
        senderId: mockUser.uid,
        senderName: mockUser.displayName,
      })
    );

    // Input should be cleared
    expect(input.value).toBe('');
  });

  it('handles errors when sending messages', async () => {
    const mockError = new Error('Failed to send message');
    push.mockRejectedValue(mockError);

    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => mockMessages,
      });
      return jest.fn();
    });

    await act(async () => {
      render(<Chat rideId="test-ride-123" />);
    });

    // Try to send a message
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.change(input, { target: { value: 'New message' } });

    const form = screen.getByRole('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    // Verify error handling
    expect(toast.error).toHaveBeenCalledWith('Failed to send message');
  });

  it('cleans up subscription on unmount', () => {
    const { unmount } = render(<Chat rideId="test-ride-123" />);
    unmount();
    expect(off).toHaveBeenCalled();
  });

  it('displays empty state when no messages', async () => {
    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => null,
      });
      return jest.fn();
    });

    await act(async () => {
      render(<Chat rideId="test-ride-123" />);
    });

    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });
}); 