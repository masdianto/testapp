import React from 'react';
import { Member, SPPD } from '../../../types';
import SekretarisSppdPage from './SekretarisSppdPage';
import PimpinanSppdPage from './PimpinanSppdPage';

interface SppdPageProps {
    member: Member;
    sppds: SPPD[];
    allMembers: Member[];
    onAdd: () => void;
    onEdit: (sppd: SPPD) => void;
    onView: (sppd: SPPD) => void;
    onUpdateSppd: (sppdId: string, updates: Partial<SPPD>) => Promise<boolean>;
}

const SppdPage: React.FC<SppdPageProps> = (props) => {
    if (props.member.role === 'Sekretaris') {
        return <SekretarisSppdPage {...props} />;
    }

    if (props.member.role === 'Pimpinan') {
        return <PimpinanSppdPage {...props} />;
    }

    return (
        <div className="p-4 text-center">
            <p>Anda tidak memiliki akses ke halaman ini.</p>
        </div>
    );
};

export default SppdPage;
