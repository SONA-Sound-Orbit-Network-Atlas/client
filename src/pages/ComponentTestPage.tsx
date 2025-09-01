import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Slider } from '@/components/ui/Slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/DropdownMenu';
import { ChevronDown, Settings, User, CreditCard, LogOut } from 'lucide-react';

const ComponentTestPage: React.FC = () => {
  const [checkboxState, setCheckboxState] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          컴포넌트 테스트 페이지
        </h1>

        {/* Checkbox 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Checkbox 컴포넌트
          </h2>
          <div className="space-y-6">
            {/* Primary Variant */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Primary Variant (파란색 테두리)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                기본 상태: 파란색 테두리, 투명 배경
                <br />
                체크된 상태: 파란색 배경, 흰색 체크 아이콘
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="primary-unchecked" variant="primary" />
                  <label
                    htmlFor="primary-unchecked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    기본 상태 (체크되지 않음)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="primary-checked"
                    defaultChecked
                    variant="primary"
                  />
                  <label
                    htmlFor="primary-checked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    체크된 상태
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="primary-disabled" disabled variant="primary" />
                  <label
                    htmlFor="primary-disabled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    비활성화된 상태
                  </label>
                </div>
              </div>
            </div>

            {/* Secondary Variant */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Secondary Variant (보라색 테두리)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                기본 상태: 보라색 테두리, 투명 배경
                <br />
                체크된 상태: 보라색 배경, 흰색 체크 아이콘
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="secondary-unchecked" variant="secondary" />
                  <label
                    htmlFor="secondary-unchecked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    기본 상태 (체크되지 않음)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="secondary-checked"
                    defaultChecked
                    variant="secondary"
                  />
                  <label
                    htmlFor="secondary-checked"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    체크된 상태
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="secondary-disabled"
                    disabled
                    variant="secondary"
                  />
                  <label
                    htmlFor="secondary-disabled"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    비활성화된 상태
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slider 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Slider 컴포넌트
          </h2>
          <div className="space-y-6">
            <div>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                label="기본 슬라이더"
                property="VOLUME"
                showCurrentValue={true}
                showMinMax={true}
                className="w-full"
              />
            </div>
            <div>
              <Slider
                defaultValue={[20, 80]}
                max={100}
                step={1}
                label="범위 슬라이더"
                property="가격 범위"
                showCurrentValue={true}
                showMinMax={true}
                className="w-full"
              />
            </div>
            <div>
              <Slider
                defaultValue={[50]}
                disabled
                label="비활성화된 슬라이더"
                property="밝기"
                showCurrentValue={true}
                showMinMax={true}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Tabs 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Tabs 컴포넌트
          </h2>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">OBJECTS</TabsTrigger>
              <TabsTrigger value="password">INFO</TabsTrigger>
              <TabsTrigger value="settings">PROPERTIES</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="mt-4 p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">계정 정보</h3>
              <p className="text-sm text-muted-foreground">
                여기에 계정 관련 내용이 들어갑니다.
              </p>
            </TabsContent>
            <TabsContent
              value="password"
              className="mt-4 p-4 border rounded-lg"
            >
              <h3 className="text-lg font-medium mb-2">비밀번호 변경</h3>
              <p className="text-sm text-muted-foreground">
                여기에 비밀번호 변경 관련 내용이 들어갑니다.
              </p>
            </TabsContent>
            <TabsContent
              value="settings"
              className="mt-4 p-4 border rounded-lg"
            >
              <h3 className="text-lg font-medium mb-2">설정</h3>
              <p className="text-sm text-muted-foreground">
                여기에 설정 관련 내용이 들어갑니다.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Dropdown Menu 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Dropdown Menu 컴포넌트
          </h2>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  드롭다운 메뉴
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>프로필</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>결제</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>설정</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  체크박스 메뉴
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem checked>
                  알림
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  이메일
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>SMS</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComponentTestPage;
