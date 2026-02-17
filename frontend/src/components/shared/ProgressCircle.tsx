'use client';

interface ProgressCircleProps {
    value: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    label?: string;
}

const sizeConfig = {
    sm: { svgSize: 80, strokeWidth: 6, fontSize: 'text-sm', radius: 32 },
    md: { svgSize: 120, strokeWidth: 8, fontSize: 'text-xl', radius: 48 },
    lg: { svgSize: 160, strokeWidth: 10, fontSize: 'text-2xl', radius: 64 },
};

export default function ProgressCircle({ value, size = 'md', label }: ProgressCircleProps) {
    const config = sizeConfig[size];
    const circumference = 2 * Math.PI * config.radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg
                width={config.svgSize}
                height={config.svgSize}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={config.svgSize / 2}
                    cy={config.svgSize / 2}
                    r={config.radius}
                    stroke="#E2E8F0"
                    strokeWidth={config.strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={config.svgSize / 2}
                    cy={config.svgSize / 2}
                    r={config.radius}
                    stroke="#0284c7"
                    strokeWidth={config.strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="animate-progress-circle"
                    style={{
                        '--progress-circumference': circumference,
                        '--progress-offset': offset,
                    } as React.CSSProperties}
                />
                {/* Center text */}
                <text
                    x="50%"
                    y="50%"
                    dominantBaseline="central"
                    textAnchor="middle"
                    className={`${config.fontSize} font-poppins font-bold fill-cnh-text-primary`}
                    transform={`rotate(90, ${config.svgSize / 2}, ${config.svgSize / 2})`}
                >
                    {value}%
                </text>
            </svg>
            {label && (
                <span className="text-sm text-cnh-text-secondary font-medium">{label}</span>
            )}
        </div>
    );
}
