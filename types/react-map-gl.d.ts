declare module 'react-map-gl/mapbox' {
  import { ComponentType, ReactNode } from 'react';

  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  }

  export interface ViewStateChangeEvent {
    viewState: ViewState;
  }

  export interface MarkerEvent<T = HTMLElement> {
    type: string;
    target: T;
    originalEvent: MouseEvent;
  }

  export interface MapProps {
    mapboxAccessToken: string;
    mapStyle?: string;
    longitude?: number;
    latitude?: number;
    zoom?: number;
    bearing?: number;
    pitch?: number;
    onMove?: (evt: ViewStateChangeEvent) => void;
    children?: ReactNode;
    [key: string]: unknown;
  }

  export interface MarkerProps {
    longitude: number;
    latitude: number;
    anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    onClick?: (evt: MarkerEvent) => void;
    children?: ReactNode;
  }

  export interface NavigationControlProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }

  const Map: ComponentType<MapProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const NavigationControl: ComponentType<NavigationControlProps>;

  export default Map;
}
