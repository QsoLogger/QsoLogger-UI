declare module 'qth-locator';

export function locatorToLatLng(locator: string): [number, number];
export function distance(from: string, to: string): number;
export function bearingDistance(from: string, to: string): [number, number];
export function latLngToLocator(lat: number, lng: number): string;
interface QthLocator {
  locatorToLatLng(locator: string): [number, number];
  distance(from: string, to: string): number;
  bearingDistance(from: string, to: string): [number, number];
  latLngToLocator(lat: number, lng: number): string;
  locatorToLatLng(locator: string): [number, number];
}

export default QthLocator;
