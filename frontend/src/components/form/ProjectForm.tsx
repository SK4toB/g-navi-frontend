// frontend/src/components/form/ProjectForm.tsx
import React from 'react';
import { projectApi, type Project } from '../../api/project';

interface ProjectFormData extends Omit<Project, 'projectId'> {
  // projectId는 서버에서 생성되므로 제외
}

// 12개 userRole 옵션
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

// 프로젝트 규모 옵션
const PROJECT_SCALES = [
  { value: 'SMALL', label: '소규모' },
  { value: 'MEDIUM', label: '중규모' },
  { value: 'MEDIUM_SMALL', label: '중소규모' },
  { value: 'LARGE', label: '대규모' },
  { value: 'VERY_LARGE', label: '초대규모' },
  { value: 'UNKNOWN', label: '미기입' }
];

// 48개 skills 옵션
const AVAILABLE_SKILLS = [
  // Software Development
  'Front-end Development', 'Back-end Development', 'Mobile Development',
  // Manufacturing Engineering   
  'Factory 기획/설계', '자동화 Engineering', '지능화 Engineering',
  // Solution Development
  'ERP_FCM', 'ERP_SCM', 'ERP_HCM', 'ERP_T&E', 'Biz. Solution',
  // Cloud/Infra Engineering
  'System/Network Engineering', 'Middleware/Database Engineering', 'Data Center Engineering', 'Cyber Security',
  // Architect
  'Software Architect', 'Data Architect', 'Infra Architect', 'AI Architect',
  // Project Management
  'Application PM', 'Infra PM', 'Solution PM',
  // Quality Management
  'PMO', 'Quality Engineering', 'Offshoring Service Professional',
  // AIX
  'AI/Data Development', 'Generative AI Development',
  // Sales
  '제 1금융', '제 2금융', '공공', 'Global', '제조-대외', '제조-대내 Hi-Tech', '제조-대내 Process', '통신', '유통/물류/서비스', '미디어/콘텐츠',
  // Biz. Consulting
  'ESG/SHE', 'ERP', 'SCM', 'CRM', 'AIX',
  // Biz. Supporting
  'Strategy Planning', 'New Biz. Development', 'Financial Management', 
  'Human Resource Management', 'Stakeholder Management', 'Governance & Public Management'
];

export default function ProjectForm() {
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
      
      if (response.isSuccess) {
        alert('프로젝트가 성공적으로 추가되었습니다!');
        // 폼 초기화
        setFormData({
          projectName: '',
          userRole: '',
          domain: '',
          projectScale: 'UNKNOWN',
          startDate: '',
          endDate: '',
          skills: []
        });
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-[#1E293B] mb-6">프로젝트 추가</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 테이블 형태의 폼 */}
        <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
          {/* 첫 번째 행: 프로젝트명, 규모 구분 */}
          <div className="border-b border-[#E2E8F0] grid grid-cols-4 gap-0">
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC] col-span-1">프로젝트명</div>
            <div className="p-4 col-span-2 border-r border-[#E2E8F0]">
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="프로젝트명을 입력하세요"
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                required
              />
            </div>
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">규모 구분</div>
            <div className="p-4">
              <select
                value={formData.projectScale}
                onChange={(e) => handleInputChange('projectScale', e.target.value)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
              >
                {PROJECT_SCALES.map((scale) => (
                  <option key={scale.value} value={scale.value}>
                    {scale.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 두 번째 행: 기간, 나의 역할 */}
          <div className="border-b border-[#E2E8F0] grid grid-cols-4 gap-0">
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">기간</div>
            <div className="p-4 flex gap-2 items-center col-span-2 border-r border-[#E2E8F0]">
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
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">나의 역할</div>
            <div className="p-4">
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
          </div>
          
          {/* 도메인 행 (기존과 동일) */}
          <div className="border-b border-[#E2E8F0] grid grid-cols-2 gap-0">
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">도메인</div>
            <div className="p-4">
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                placeholder="도메인을 입력하세요 (예: FE/BE, 금융, 제조업 등)"
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#122250]"
                required
              />
            </div>
          </div>

          {/* 기술 스택 행 (기존과 동일) */}
          <div className="grid grid-cols-2 gap-0">
            <div className="p-4 font-medium text-[#1E293B] border-r border-[#E2E8F0] bg-[#F8FAFC]">기술 스택</div>
            <div className="p-4">
              {/* 직접 입력 */}
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

              {/* 선택 가능한 기술 스택 */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">추천 기술 스택:</p>
                <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto border border-gray-200 p-2 rounded">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillSelect(skill)}
                      className="text-left px-2 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
                      disabled={formData.skills.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 선택된 기술 스택 표시 */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#E2E8F0] text-[#1E293B] rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                projectName: '',
                userRole: '',
                domain: '',
                projectScale: 'UNKNOWN',
                startDate: '',
                endDate: '',
                skills: []
              });
            }}
            className="px-6 py-2 border border-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#F9FAFB] transition-colors"
          >
            초기화
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
  );
}