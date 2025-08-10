# Requirements Document

## Introduction

This document defines the requirements for optimization and improvement of the raffle system, focusing on reducing resource consumption, fixing bugs, improving the raffle flow, and implementing a modern modal for winner confirmation. The goal is to create a more efficient, reliable system with better user experience.

## Requirements

### Requirement 1: Correção de Erros e Otimização de Imports

**User Story:** Como desenvolvedor, quero que todos os erros de TypeScript sejam corrigidos e os imports sejam otimizados, para que o projeto compile sem erros e tenha melhor performance.

#### Acceptance Criteria

1. WHEN o projeto é compilado THEN o sistema SHALL não apresentar erros de TypeScript relacionados a imports de React
2. WHEN componentes são importados THEN o sistema SHALL usar imports explícitos em vez de globals UMD
3. WHEN componentes UI são utilizados THEN o sistema SHALL importar corretamente de '@/components/ui/*'
4. WHEN tipos são utilizados THEN o sistema SHALL importar corretamente de '@/lib/types'

### Requirement 2: Otimização de Performance e Recursos

**User Story:** Como administrador do sistema, quero que o consumo de recursos seja otimizado, para que o sistema seja mais eficiente e tenha menor custo operacional.

#### Acceptance Criteria

1. WHEN dados são carregados THEN o sistema SHALL implementar lazy loading para componentes pesados
2. WHEN participantes são listados THEN o sistema SHALL implementar virtualização para listas grandes
3. WHEN confetti é executado THEN o sistema SHALL limitar a quantidade de partículas baseado no dispositivo
4. WHEN dados são atualizados THEN o sistema SHALL usar debounce para evitar múltiplas chamadas desnecessárias
5. WHEN imagens são carregadas THEN o sistema SHALL implementar otimização de imagens

### Requirement 3: Melhoria do Fluxo de Sorteios

**User Story:** Como usuário do sistema, quero que o fluxo de sorteios seja mais intuitivo e confiável, para que eu possa realizar sorteios sem confusão sobre o estado atual.

#### Acceptance Criteria

1. WHEN um sorteio é iniciado THEN o sistema SHALL verificar se há participantes suficientes
2. WHEN vencedores são sorteados THEN o sistema SHALL atualizar corretamente a contagem de vencedores restantes
3. WHEN o número total de vencedores é atingido THEN o botão "Sorteio Concluído" SHALL ser exibido
4. WHEN há participantes restantes mas o limite de vencedores foi atingido THEN o botão SHALL mostrar "Sorteio Concluído"
5. WHEN não há participantes restantes THEN o botão SHALL mostrar "Sorteio Concluído"

### Requirement 4: Modal de Confirmação de Vencedor

**User Story:** Como operador de sorteio, quero ver um modal moderno e animado quando um vencedor é sorteado, para que eu possa confirmar ou cancelar o resultado antes de finalizar.

#### Acceptance Criteria

1. WHEN um participante é sorteado THEN o sistema SHALL exibir um modal com animação moderna
2. WHEN o modal é exibido THEN o sistema SHALL mostrar o nome do vencedor de forma destacada
3. WHEN o modal é exibido THEN o sistema SHALL apresentar botões "Cancelar" e "Confirmar Vencedor"
4. WHEN "Confirmar Vencedor" é clicado THEN o sistema SHALL adicionar o vencedor à lista final
5. WHEN "Cancelar" é clicado THEN o sistema SHALL retornar o participante à lista de elegíveis
6. WHEN o modal está aberto THEN o sistema SHALL bloquear outras ações de sorteio

### Requirement 5: Controle de Estado do Botão de Sorteio

**User Story:** Como operador de sorteio, quero que o botão de sorteio reflita corretamente o estado atual do sorteio, para que eu saiba exatamente quando posso sortear mais vencedores.

#### Acceptance Criteria

1. WHEN há participantes e vagas de vencedores disponíveis THEN o botão SHALL estar ativo e mostrar "Sortear X Vencedor(es)"
2. WHEN está sorteando THEN o botão SHALL estar desabilitado e mostrar "Sorteando..." com spinner
3. WHEN o número máximo de vencedores foi atingido THEN o botão SHALL estar desabilitado e mostrar "Sorteio Concluído"
4. WHEN não há mais participantes THEN o botão SHALL estar desabilitado e mostrar "Sorteio Concluído"
5. WHEN o sorteio é concluído THEN o sistema SHALL atualizar o status do sorteio no banco de dados

### Requirement 6: Melhoria da Experiência Visual

**User Story:** Como usuário do sistema, quero uma interface mais polida e responsiva, para que a experiência seja agradável em qualquer dispositivo.

#### Acceptance Criteria

1. WHEN a página é carregada THEN o sistema SHALL exibir animações suaves de entrada
2. WHEN elementos são interativos THEN o sistema SHALL fornecer feedback visual claro
3. WHEN o layout é exibido em mobile THEN o sistema SHALL manter usabilidade completa
4. WHEN confetti é executado THEN o sistema SHALL usar animações otimizadas para performance
5. WHEN dados estão carregando THEN o sistema SHALL exibir skeletons em vez de telas em branco

### Requirement 7: Tratamento de Erros e Estados de Loading

**User Story:** Como usuário do sistema, quero que erros sejam tratados graciosamente e estados de loading sejam claros, para que eu sempre saiba o que está acontecendo no sistema.

#### Acceptance Criteria

1. WHEN ocorre erro na busca de dados THEN o sistema SHALL exibir mensagem de erro clara
2. WHEN dados estão carregando THEN o sistema SHALL mostrar indicadores de loading apropriados
3. WHEN uma operação falha THEN o sistema SHALL permitir retry da operação
4. WHEN conexão com Firebase falha THEN o sistema SHALL mostrar status de conectividade
5. WHEN dados são salvos THEN o sistema SHALL confirmar sucesso da operação

### Requirement 8: Otimização de Consultas Firebase

**User Story:** Como administrador do sistema, quero que as consultas ao Firebase sejam otimizadas, para reduzir custos e melhorar performance.

#### Acceptance Criteria

1. WHEN dados são buscados THEN o sistema SHALL usar consultas específicas em vez de buscar documentos completos
2. WHEN dados são atualizados THEN o sistema SHALL usar batch operations quando possível
3. WHEN participantes são filtrados THEN o sistema SHALL fazer filtragem no cliente para dados já carregados
4. WHEN dados são sincronizados THEN o sistema SHALL implementar cache local para reduzir consultas
5. WHEN múltiplas operações são necessárias THEN o sistema SHALL usar transações Firebase


# Design Document

## Overview

This design document outlines the technical approach for optimizing the raffle system. The optimization focuses on fixing TypeScript errors, improving performance, enhancing user experience, and implementing a modern winner confirmation modal. The solution maintains the existing Next.js + Firebase architecture while introducing performance optimizations, better state management, and improved UI components.

## Architecture

### Current Architecture
- **Frontend**: Next.js 15 with React 18, TypeScript
- **UI Framework**: Tailwind CSS with Radix UI components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React hooks (useState, useEffect)
- **Animations**: CSS animations + canvas-confetti library

### Proposed Architecture Enhancements
- **Component Structure**: Modular components with clear separation of concerns
- **State Management**: Optimized React hooks with proper dependency management
- **Performance Layer**: Lazy loading, virtualization, and memoization
- **Error Handling**: Centralized error boundary and retry mechanisms
- **Loading States**: Skeleton components and progressive loading

## Components and Interfaces

### 1. Core Components Refactoring

#### RaffleRunPage Component
```typescript
interface RaffleRunPageProps {
  raffleId: string;
  numToDraw?: number;
}

interface RaffleState {
  raffleData: Raffle | null;
  participants: Participant[];
  winners: Participant[];
  loading: boolean;
  error: string | null;
  drawing: boolean;
}
```

#### Winner Confirmation Modal
```typescript
interface WinnerConfirmationModalProps {
  isOpen: boolean;
  winner: Participant | null;
  onConfirm: (winner: Participant) => void;
  onCancel: () => void;
  onClose: () => void;
}

interface ModalAnimationConfig {
  duration: number;
  easing: string;
  particles: ConfettiConfig;
}
```

#### Performance-Optimized Lists
```typescript
interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}
```

### 2. Custom Hooks

#### useRaffleData Hook
```typescript
interface UseRaffleDataReturn {
  raffleData: Raffle | null;
  participants: Participant[];
  winners: Participant[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useRaffleData(raffleId: string): UseRaffleDataReturn;
```

#### useOptimizedConfetti Hook
```typescript
interface ConfettiConfig {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
  gravity: number;
  drift: number;
}

function useOptimizedConfetti(): {
  triggerConfetti: (config: Partial<ConfettiConfig>) => void;
  isSupported: boolean;
};
```

#### useDebounce Hook
```typescript
function useDebounce<T>(value: T, delay: number): T;
```

### 3. Utility Components

#### LoadingSkeleton Component
```typescript
interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'button' | 'text';
  count?: number;
  className?: string;
}
```

#### ErrorBoundary Component
```typescript
interface ErrorBoundaryProps {
  fallback: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}
```

## Data Models

### Enhanced Raffle Interface
```typescript
interface OptimizedRaffle extends Raffle {
  // Performance tracking
  lastUpdated: Timestamp;
  participantCount: number; // Cached count
  winnerCount: number; // Cached count
  
  // State management
  isDrawing: boolean;
  drawHistory: DrawEvent[];
  
  // Configuration
  animationConfig: AnimationConfig;
  performanceMode: 'high' | 'medium' | 'low';
}

interface DrawEvent {
  id: string;
  timestamp: Timestamp;
  winnerId: string;
  winnerName: string;
  confirmed: boolean;
}

interface AnimationConfig {
  confettiEnabled: boolean;
  particleCount: number;
  animationDuration: number;
  reducedMotion: boolean;
}
```

### Performance Metrics
```typescript
interface PerformanceMetrics {
  renderTime: number;
  dataFetchTime: number;
  confettiRenderTime: number;
  memoryUsage: number;
  deviceCapabilities: DeviceCapabilities;
}

interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  supportsWebGL: boolean;
  maxParticles: number;
}
```

## Error Handling

### Error Types
```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  FIREBASE_ERROR = 'FIREBASE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERFORMANCE_ERROR = 'PERFORMANCE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  retryable: boolean;
  timestamp: Date;
}
```

### Error Handling Strategy
1. **Network Errors**: Automatic retry with exponential backoff
2. **Firebase Errors**: Specific error messages with suggested actions
3. **Validation Errors**: Immediate user feedback with correction hints
4. **Performance Errors**: Graceful degradation to simpler UI
5. **Unknown Errors**: Generic error boundary with error reporting

### Retry Mechanism
```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig
): Promise<T>;
```

## Testing Strategy

### Unit Testing
- **Components**: Test rendering, props handling, and user interactions
- **Hooks**: Test state management and side effects
- **Utilities**: Test helper functions and data transformations
- **Firebase Operations**: Mock Firebase calls and test error scenarios

### Integration Testing
- **Raffle Flow**: End-to-end raffle execution
- **Modal Interactions**: Winner confirmation flow
- **Performance**: Measure rendering times and memory usage
- **Error Scenarios**: Network failures and data corruption

### Performance Testing
- **Load Testing**: Large participant lists (1000+ participants)
- **Memory Testing**: Long-running sessions
- **Animation Testing**: Confetti performance on different devices
- **Network Testing**: Slow connections and offline scenarios

### Test Structure
```typescript
// Component Tests
describe('RaffleRunPage', () => {
  describe('Winner Selection', () => {
    it('should open confirmation modal when winner is drawn');
    it('should handle winner confirmation correctly');
    it('should handle winner cancellation correctly');
  });
  
  describe('Performance', () => {
    it('should virtualize large participant lists');
    it('should debounce rapid button clicks');
    it('should optimize confetti for mobile devices');
  });
});

// Hook Tests
describe('useRaffleData', () => {
  it('should fetch raffle data correctly');
  it('should handle loading states');
  it('should retry on network errors');
});
```

## Performance Optimizations

### 1. Component Optimization
- **React.memo**: Memoize expensive components
- **useMemo**: Cache computed values
- **useCallback**: Stabilize function references
- **Lazy Loading**: Code-split heavy components

### 2. List Virtualization
```typescript
// For large participant lists
const VirtualizedParticipantList = React.memo(({ participants }: { participants: Participant[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { visibleItems, scrollProps } = useVirtualization({
    items: participants,
    itemHeight: 60,
    containerHeight: 400,
    overscan: 5
  });
  
  return (
    <div ref={containerRef} {...scrollProps}>
      {visibleItems.map(({ item, index, style }) => (
        <div key={item.id} style={style}>
          <ParticipantCard participant={item} />
        </div>
      ))}
    </div>
  );
});
```

### 3. Confetti Optimization
```typescript
const useOptimizedConfetti = () => {
  const deviceCapabilities = useDeviceCapabilities();
  
  const triggerConfetti = useCallback((config: Partial<ConfettiConfig>) => {
    const optimizedConfig = {
      ...config,
      particleCount: Math.min(
        config.particleCount || 100,
        deviceCapabilities.maxParticles
      ),
      gravity: deviceCapabilities.isMobile ? 0.8 : 0.5,
      drift: deviceCapabilities.isLowEnd ? 0 : config.drift || 0
    };
    
    confetti(optimizedConfig);
  }, [deviceCapabilities]);
  
  return { triggerConfetti };
};
```

### 4. Firebase Optimization
```typescript
// Batch operations for multiple updates
const updateRaffleWithWinners = async (
  raffleId: string, 
  newWinners: Participant[]
) => {
  const batch = writeBatch(db);
  const raffleRef = doc(db, 'raffles', raffleId);
  
  // Update raffle document
  batch.update(raffleRef, {
    winners: arrayUnion(...newWinners),
    winnerCount: increment(newWinners.length),
    lastUpdated: serverTimestamp()
  });
  
  // Add individual winner records for analytics
  newWinners.forEach(winner => {
    const winnerRef = doc(collection(db, 'winners'));
    batch.set(winnerRef, {
      raffleId,
      participantId: winner.id,
      timestamp: serverTimestamp(),
      confirmed: false
    });
  });
  
  await batch.commit();
};
```

## Implementation Plan Integration

### Phase 1: Foundation (Requirements 1, 7, 8)
- Fix TypeScript errors and optimize imports
- Implement error handling and loading states
- Optimize Firebase queries

### Phase 2: Performance (Requirements 2, 6)
- Implement lazy loading and virtualization
- Optimize confetti and animations
- Add performance monitoring

### Phase 3: User Experience (Requirements 3, 4, 5)
- Improve raffle flow logic
- Implement winner confirmation modal
- Enhance button state management

### Phase 4: Polish and Testing
- Add comprehensive testing
- Performance optimization
- Documentation and cleanup

## Technical Decisions

### 1. Modal Implementation
- **Choice**: Custom modal with Radix UI Dialog primitive
- **Rationale**: Better control over animations and performance
- **Alternative**: Third-party modal library (rejected due to bundle size)

### 2. Virtualization Library
- **Choice**: Custom virtualization hook
- **Rationale**: Lightweight, specific to our needs
- **Alternative**: react-window (rejected due to complexity)

### 3. State Management
- **Choice**: Enhanced React hooks with context for global state
- **Rationale**: Maintains simplicity while improving organization
- **Alternative**: Redux/Zustand (rejected due to over-engineering)

### 4. Animation Strategy
- **Choice**: CSS animations + optimized canvas-confetti
- **Rationale**: Better performance and device compatibility
- **Alternative**: Framer Motion (rejected due to bundle size)

## Security Considerations

### 1. Data Validation
- Validate all user inputs before Firebase operations
- Sanitize participant data to prevent XSS
- Implement rate limiting for draw operations

### 2. Firebase Security
- Use Firebase Security Rules to protect data
- Implement proper authentication checks
- Audit Firebase operations for unauthorized access

### 3. Client-Side Security
- Prevent manipulation of winner selection
- Validate raffle state before operations
- Implement CSRF protection for sensitive operations


# Implementation Plan

- [ ] 1. Fix TypeScript errors and optimize imports
  - Fix React import issues by adding explicit React imports where needed
  - Update all component files to use proper TypeScript imports
  - Ensure all UI components are imported correctly from '@/components/ui/*'
  - Verify all type imports from '@/lib/types' are working correctly
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Create performance optimization utilities
- [ ] 2.1 Implement device capabilities detection hook
  - Create useDeviceCapabilities hook to detect mobile, low-end devices, and WebGL support
  - Add logic to determine optimal particle counts and animation settings
  - Write unit tests for device detection logic
  - _Requirements: 2.3, 6.4_

- [ ] 2.2 Create debounce hook for preventing multiple rapid calls
  - Implement useDebounce hook with configurable delay
  - Add useCallback optimization for function stability
  - Write unit tests for debounce functionality
  - _Requirements: 2.4_

- [ ] 2.3 Implement optimized confetti hook
  - Create useOptimizedConfetti hook that adapts to device capabilities
  - Add particle count limits based on device performance
  - Implement cleanup for confetti animations
  - Write unit tests for confetti optimization
  - _Requirements: 2.3, 6.4_

- [ ] 3. Create virtualized list component for large participant lists
  - Implement VirtualizedList component with configurable item height
  - Add overscan support for smooth scrolling
  - Create ParticipantList component using virtualization
  - Write unit tests for virtualization logic
  - _Requirements: 2.2_

- [ ] 4. Implement winner confirmation modal
- [ ] 4.1 Create WinnerConfirmationModal component
  - Build modal component using Radix UI Dialog primitive
  - Add modern animations for modal entrance and exit
  - Implement winner name display with highlighting
  - Create confirm and cancel button handlers
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4.2 Add modal state management and integration
  - Integrate modal with main raffle component
  - Implement modal open/close state management
  - Add logic to block other actions when modal is open
  - Handle winner confirmation and cancellation flows
  - _Requirements: 4.4, 4.5, 4.6_

- [ ] 5. Enhance raffle flow logic and button state management
- [ ] 5.1 Implement improved raffle state logic
  - Add participant count validation before drawing
  - Update winner count tracking logic
  - Implement proper state updates for remaining winners
  - Add logic to determine when raffle is complete
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 5.2 Create dynamic button state management
  - Implement getButtonText function with proper state detection
  - Add loading spinner and disabled states
  - Update button text based on available participants and winner slots
  - Add "Sorteio Concluído" state when raffle is finished
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Implement error handling and loading states
- [ ] 6.1 Create error boundary component
  - Implement ErrorBoundary component with retry functionality
  - Add error logging and user-friendly error messages
  - Create fallback UI for different error types
  - Write unit tests for error boundary behavior
  - _Requirements: 7.1, 7.3_

- [ ] 6.2 Add loading skeleton components
  - Create LoadingSkeleton component with multiple variants
  - Replace blank screens with skeleton loading states
  - Add progressive loading for different UI sections
  - Implement smooth transitions between loading and loaded states
  - _Requirements: 6.5, 7.2_

- [ ] 6.3 Implement retry mechanisms for failed operations
  - Create withRetry utility function with exponential backoff
  - Add retry logic to Firebase operations
  - Implement connection status monitoring
  - Add user feedback for retry attempts
  - _Requirements: 7.3, 7.4_

- [ ] 7. Optimize Firebase operations
- [ ] 7.1 Implement batch operations for winner updates
  - Create updateRaffleWithWinners function using Firebase batch writes
  - Add transaction support for atomic operations
  - Implement proper error handling for batch operations
  - Write unit tests for batch update logic
  - _Requirements: 8.2, 8.5_

- [ ] 7.2 Add local caching for frequently accessed data
  - Implement local state caching for participant filtering
  - Add cache invalidation logic for data updates
  - Create cache management utilities
  - Write unit tests for caching behavior
  - _Requirements: 8.4_

- [ ] 7.3 Optimize Firebase queries with specific field selection
  - Update Firebase queries to fetch only required fields
  - Implement query optimization for large datasets
  - Add pagination support for large participant lists
  - Write unit tests for optimized queries
  - _Requirements: 8.1, 8.3_

- [ ] 8. Enhance visual experience and animations
- [ ] 8.1 Add smooth entrance animations for page elements
  - Implement CSS animations for component mounting
  - Add staggered animations for list items
  - Create smooth transitions for state changes
  - Ensure animations respect reduced motion preferences
  - _Requirements: 6.1, 6.4_

- [ ] 8.2 Improve interactive feedback and hover states
  - Add hover effects for all interactive elements
  - Implement focus states for accessibility
  - Create visual feedback for button interactions
  - Add loading states for async operations
  - _Requirements: 6.2_

- [ ] 8.3 Ensure mobile responsiveness and usability
  - Test and fix mobile layout issues
  - Optimize touch interactions for mobile devices
  - Ensure proper spacing and sizing on small screens
  - Add mobile-specific optimizations
  - _Requirements: 6.3_

- [ ] 9. Add comprehensive error handling with user feedback
- [ ] 9.1 Implement operation success confirmations
  - Add toast notifications for successful operations
  - Create visual feedback for data saves
  - Implement confirmation messages for critical actions
  - Add progress indicators for long-running operations
  - _Requirements: 7.5_

- [ ] 9.2 Add network connectivity monitoring
  - Implement connection status detection
  - Add offline/online state management
  - Create user feedback for connectivity issues
  - Add automatic retry when connection is restored
  - _Requirements: 7.4_

- [ ] 10. Performance monitoring and optimization
- [ ] 10.1 Add performance metrics collection
  - Implement render time measurement
  - Add memory usage monitoring
  - Create performance reporting utilities
  - Add device capability detection and logging
  - _Requirements: 2.1, 2.5_

- [ ] 10.2 Implement lazy loading for heavy components
  - Add React.lazy for code splitting
  - Implement dynamic imports for large dependencies
  - Create loading boundaries for lazy components
  - Write unit tests for lazy loading behavior
  - _Requirements: 2.1_

- [ ] 11. Integration and testing
- [ ] 11.1 Write comprehensive unit tests for all new components
  - Test modal component behavior and interactions
  - Test hooks for proper state management
  - Test utility functions and error handling
  - Achieve minimum 80% code coverage
  - _Requirements: All requirements validation_

- [ ] 11.2 Implement integration tests for raffle flow
  - Test complete winner selection and confirmation flow
  - Test error scenarios and recovery
  - Test performance with large datasets
  - Validate all requirements are met through automated tests
  - _Requirements: All requirements validation_

- [ ] 12. Final optimization and cleanup
- [ ] 12.1 Optimize bundle size and remove unused code
  - Remove unused imports and dependencies
  - Optimize component re-renders with React.memo
  - Clean up console logs and debug code
  - Verify TypeScript compilation without errors
  - _Requirements: 1.1, 2.1_

- [ ] 12.2 Update raffle status in database when completed
  - Add logic to update raffle status to 'Concluído' when all winners are drawn
  - Implement proper state synchronization with Firebase
  - Add timestamp tracking for raffle completion
  - Write unit tests for status update logic
  - _Requirements: 5.5_