/**
 * Play a notification sound
 * Uses the Web Audio API to play a simple beep sound
 */
export function playNotificationSound() {
    try {
        // Check if user has enabled sound notifications
        const soundEnabled = localStorage.getItem('notificationSound') !== 'false';
        if (!soundEnabled) return;

        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create oscillator (tone generator)
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure sound
        oscillator.frequency.value = 800; // Frequency in Hz
        oscillator.type = 'sine'; // Sine wave for smooth sound

        // Configure volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        // Play sound
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Clean up
        setTimeout(() => {
            audioContext.close();
        }, 500);
    } catch (error) {
        console.warn('Failed to play notification sound:', error);
    }
}

/**
 * Toggle notification sound preference
 */
export function toggleNotificationSound(): boolean {
    const current = localStorage.getItem('notificationSound') !== 'false';
    const newValue = !current;
    localStorage.setItem('notificationSound', String(newValue));
    return newValue;
}

/**
 * Check if notification sound is enabled
 */
export function isNotificationSoundEnabled(): boolean {
    return localStorage.getItem('notificationSound') !== 'false';
}
