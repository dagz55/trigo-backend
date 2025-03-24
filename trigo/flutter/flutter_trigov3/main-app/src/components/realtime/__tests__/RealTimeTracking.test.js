import { act, render, screen } from '@testing-library/react';
import { getDatabase, off, onValue, ref } from 'firebase/database';
import React from 'react';
import { toast } from 'react-toastify';
import RealTimeTracking from '../RealTimeTracking';

// Mock Firebase Realtime Database
jest.mock('firebase/database');

// Mock react-toastify
jest.mock('react-toastify');

describe('RealTimeTracking Component', () => {
  const mockProps = {
    rideId: 'test-ride-123',
    pickup: { lat: 14.5995, lng: 120.9842 },
    destination: { lat: 14.6042, lng: 120.9822 },
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock getDatabase
    getDatabase.mockReturnValue({});

    // Mock ref
    ref.mockReturnValue({});

    // Mock window.google.maps
    global.window.google = {
      maps: {
        Size: jest.fn(),
      },
    };
  });

  it('renders loading state initially', () => {
    render(<RealTimeTracking {...mockProps} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('updates driver location when receiving real-time updates', async () => {
    const mockDriverLocation = {
      latitude: 14.6010,
      longitude: 120.9832,
    };

    // Mock onValue to simulate real-time updates
    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => mockDriverLocation,
      });
      return jest.fn(); // Return unsubscribe function
    });

    await act(async () => {
      render(<RealTimeTracking {...mockProps} />);
    });

    // Verify that the loading state is removed
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Verify that the ETA information is displayed
    expect(screen.getByText(/Driver is on the way/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated arrival in/i)).toBeInTheDocument();
  });

  it('handles errors when tracking driver location', async () => {
    const mockError = new Error('Failed to track driver');

    // Mock onValue to simulate error
    onValue.mockImplementation((ref, callback, errorCallback) => {
      errorCallback(mockError);
      return jest.fn();
    });

    await act(async () => {
      render(<RealTimeTracking {...mockProps} />);
    });

    // Verify error handling
    expect(toast.error).toHaveBeenCalledWith('Failed to track driver location');
  });

  it('calculates ETA correctly', async () => {
    const mockDriverLocation = {
      latitude: 14.6010,
      longitude: 120.9832,
    };

    onValue.mockImplementation((ref, callback) => {
      callback({
        val: () => mockDriverLocation,
      });
      return jest.fn();
    });

    await act(async () => {
      render(<RealTimeTracking {...mockProps} />);
    });

    // Get the ETA text and verify it contains a number
    const etaText = screen.getByText(/Estimated arrival in \d+ minutes/);
    expect(etaText).toBeInTheDocument();
  });

  it('cleans up subscription on unmount', () => {
    const { unmount } = render(<RealTimeTracking {...mockProps} />);
    unmount();
    expect(off).toHaveBeenCalled();
  });
}); 