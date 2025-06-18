// frontend/src/components/profile/ProjectFormModal.tsx
import React from 'react';
import { projectApi, type Project } from '../../api/project';

interface ProjectFormData extends Omit<Project, 'projectId'> {
  // projectId는 서버에서 생성되므로 제외
}

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project) => void;
}

const USER_ROLES = [
  'Software Development',
  'Manufacturing Engineering', 
  'Solution Development',
  'Cloud/Infra Engineering',
  'Architect',
  'Project Management',
  'Quality Management',
  'AIX',
  'Sales',
  'Domain Expert',
  'Biz. Consulting',
  'Biz. Supporting'
];

const PROJECT_SCALES = [
  { value: 'SMALL', label: '소규모' },
  { value: 'MEDIUM', label: '중규모' },
  { value: 'MEDIUM_SMALL', label: '중소규모' },
  { value: 'LARGE', label: '대규모' },
  { value: 'VERY_LARGE', label: '초대규모' },
  { value: 'UNKNOWN', label: '미기입' }
];

const AVAILABLE_SKILLS = [
  'Front-end Development', 'Back-end Development', 'Mobile Development',
  'Factory 기획/설계', '자동화 Engineering', '지능화 Engineering',
  'ERP_FCM', 'ERP_SCM', 'ERP_HCM', 'ERP_T&E', 'Biz. Solution',
  'System/Network Engineering', 'Middleware/Database Engineering', 'Data Center Engineering', 'Cyber Security',
  'Software Architect', 'Data Architect', 'Infra Architect', 'AI Architect',
  'Application PM', 'Infra PM', 'Solution PM',
  'PMO', 'Quality Engineering', 'Offshoring Service Professional',
  'AI/Data Development', 'Generative AI Development',
  '제 1금융', '제 2금융', '공공', 'Global', '제조-대외', '제조-대내 Hi-Tech', '제조-대내 Process', '통신', '유통/물류/서비스', '미디어/콘텐츠',
  'ESG/SHE', 'ERP', 'SCM', 'CRM', 'AIX',
  'Strategy Planning', 'New Biz. Development', 'Financial Management', 
  'Human Resource Management', 'Stakeholder Management', 'Governance & Public Management'
];

export default function ProjectFormModal({ isOpen, onClose, onProjectAdded }: ProjectFormModalProps) {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    projectName: '',
    userRole: '',
    domain: '',
    projectScale: 'UNKNOWN',
    startDate: '',
    endDate: '',
    skills: []
  });

  const [currentSkill, setCurrentSkill] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // 모달이 닫힐 때 폼 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        projectName: '',
        userRole: '',
        domain: '',
        projectScale: 'UNKNOWN',
        startDate: '',
        endDate: '',
        skills: []
      });
      setCurrentSkill('');
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectName || !formData.userRole || !formData.domain) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await projectApi.createProject(formData);
      
      if (response.isSuccess && response.result) {
        alert('프로젝트가 성공적으로 추가되었습니다!');
        onProjectAdded(response.result as Project);
        onClose();
      } else {
        alert(`프로젝트 추가 실패: ${response.message}`);
      }
    } catch (error) {
      console.error('프로젝트 추가 중 오류:', error);
      alert('프로젝트 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 선택되지 않은 스킬만 필터링
  const availableSkillsFiltered = AVAILABLE_SKILLS.filter(skill => !formData.skills.includes(skill));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E293B]">프로젝트 추가</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* 폼 내용 */}
            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
              {/* 첫 번째 행: 프로젝트명(도메인) */}
              <div className="border-b border-[#E2E8F0] grid grid-cols-8 gap-0">
                <div className="p-4 col-span-2 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">프로젝트명 / 도메인</div>
                <div className="p-4 col-span-3 border-r border-[#E2E8F0]">
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="프로젝트명을 입력하세요"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                    required
                  />
                </div>
                <div className="p-4 col-span-3">
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    placeholder="도메인 (예: FE/BE, 금융 등)"
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                    required
                  />
                </div>
              </div>

              {/* 두 번째 행: 기간, 규모 구분 */}
              <div className="border-b border-[#E2E8F0] grid grid-cols-8 gap-0">
                <div className="p-4 col-span-2 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">기간 / 규모</div>
                <div className="p-4 col-span-4 flex gap-2 items-center border-r border-[#E2E8F0]">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                  />
                  <span>~</span>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                  />
                </div>
                <div className="p-4 col-span-2">
                  <select
                    value={formData.projectScale}
                    onChange={(e) => handleInputChange('projectScale', e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                  >
                    <option value="">규모 구분</option>
                    {PROJECT_SCALES.map((scale) => (
                      <option key={scale.value} value={scale.value}>
                        {scale.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 세 번째 행: 나의 역할 */}
              <div className="border-b border-[#E2E8F0] grid grid-cols-8 gap-0">
                <div className="p-4 col-span-2 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">나의 역할 / 기술 스택</div>
                <div className="p-4 col-span-2 border-r border-[#E2E8F0]">
                  <select
                    value={formData.userRole}
                    onChange={(e) => handleInputChange('userRole', e.target.value)}
                    className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                    required
                  >
                    <option value="">역할을 선택하세요</option>
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-4 col-span-4 ">
                <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="기술 스택을 직접 입력하세요"
                      className="flex-1 px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd();
                        }
                      }}
                      />
                    <button
                      type="button"
                      onClick={handleSkillAdd}
                      className="px-4 py-2 bg-[#122250] text-white rounded-md hover:bg-[#1e3a5f] transition-colors"
                      >
                      추가
                    </button>
                      </div>
                  </div>
              </div>

              {/* 네 번째 행: 기술 스택 */}
              <div className="grid grid-cols-2 gap-4 p-4">
                {/* 왼쪽: 추천 기술 스택 (선택되지 않은 것만 표시) */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    추천 기술 스택 ({availableSkillsFiltered.length}개):
                  </p>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto border border-gray-200 p-2 rounded">
                    {availableSkillsFiltered.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillSelect(skill)}
                        className="text-left px-2 py-1 text-sm hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                    {availableSkillsFiltered.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-4">
                        모든 추천 스킬이 선택되었습니다
                      </p>
                    )}
                  </div>
                </div>

                {/* 오른쪽: 선택된 기술 스택 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    선택된 기술 스택 ({formData.skills.length}개):
                  </p>
                  <div className="min-h-[100px] border border-gray-200 p-2 rounded">
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {formData.skills.length === 0 && (
                      <p className="text-gray-400 text-sm text-center py-8">
                        선택된 기술 스택이 없습니다
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#122250] text-white rounded-md hover:bg-[#1e3a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '추가 중...' : '프로젝트 추가'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}