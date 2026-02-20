import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../styles/theme';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 *
 * @example
 * ```typescript
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log the error to console
        console.error('ErrorBoundary caught an error:', {
            error,
            errorInfo,
            componentStack: errorInfo.componentStack,
        });

        // Update state with error info
        this.setState({
            errorInfo,
        });

        // You can also log to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="alert-circle" size={80} color={COLORS.primaryBlue} />
                        </View>

                        <Text style={styles.title}>Oups ! Une erreur est survenue</Text>

                        <Text style={styles.message}>
                            L'application a rencontré un problème inattendu.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <ScrollView style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Détails de l'erreur:</Text>
                                <Text style={styles.errorText}>
                                    {this.state.error.toString()}
                                </Text>
                                {this.state.errorInfo && (
                                    <>
                                        <Text style={styles.errorTitle}>Stack trace:</Text>
                                        <Text style={styles.errorText}>
                                            {this.state.errorInfo.componentStack}
                                        </Text>
                                    </>
                                )}
                            </ScrollView>
                        )}

                        <TouchableOpacity style={styles.button} onPress={this.handleReset}>
                            <Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Réessayer</Text>
                        </TouchableOpacity>

                        <Text style={styles.hint}>
                            Si le problème persiste, essayez de redémarrer l'application.
                        </Text>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontFamily: FONTS.title,
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        fontFamily: FONTS.body,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    errorDetails: {
        width: '100%',
        maxHeight: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    errorTitle: {
        fontSize: 14,
        fontFamily: FONTS.bodyBold,
        color: COLORS.textDark,
        marginBottom: 8,
        marginTop: 8,
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'Courier',
        color: '#d32f2f',
        marginBottom: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlue,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: FONTS.bodyBold,
    },
    hint: {
        fontSize: 12,
        fontFamily: FONTS.body,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default ErrorBoundary;
