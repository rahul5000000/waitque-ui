import React from 'react';
import { Image } from 'react-native';
import { useAppContext } from '../hooks/AppContext';

type LogoSize = 'small' | 'medium' | 'large' | number;

export default function Logo({ size = 'medium' as LogoSize }: { size?: LogoSize }) {
    const { company } = useAppContext();

    const sizeMap: Record<'small' | 'medium' | 'large', number> = {
        small: 24,
        medium: 50,
        large: 100,
    };

    const pixelSize = typeof size === 'number' ? size : sizeMap[size] ?? sizeMap.medium;

    return (
        <>
        { company.logoUrl ? <Image
                style={{ width: pixelSize, height: pixelSize }}
                source={{ uri: company.logoUrl }}
                accessibilityLabel={`${company?.name || 'Company'} logo`}/> 
            : null }
        </>
    );
}