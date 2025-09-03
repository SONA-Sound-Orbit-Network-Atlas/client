import React, { useState } from 'react';
import { Checkbox } from '@/components/common/Checkbox';
import { Slider } from '@/components/common/Slider';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/common/Tabs';
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
} from '@/components/common/DropdownMenu';
import { ChevronDown, Settings, User, CreditCard, LogOut } from 'lucide-react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import TextField from '@/components/common/TextField';
import Textarea from '@/components/common/Textarea';
import TextInput from '@/components/common/TextInput';
import GalaxySystemIndex from '@/components/panel/galaxysystems/GalaxySystemIndex';
import { FaHeart } from 'react-icons/fa6';
import { FiGithub } from 'react-icons/fi';

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

        {/* Button 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Button 컴포넌트
          </h2>
          <div className="space-y-6">
            {/* Color 기준 */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Color 기준
              </h3>
              <div className="flex gap-4 items-center flex-wrap">
                <Button color="primary">primary</Button>
                <Button color="secondary">secondary</Button>
                <Button color="tertiary">tertiary</Button>
                <Button color="tertiary" disabled>
                  disabled
                </Button>
              </div>
            </div>

            {/* Size 기준 */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Size 기준
              </h3>
              <div className="flex gap-4 items-center flex-wrap">
                <Button color="primary" size="lg">
                  lg
                </Button>
                <Button color="primary" size="md">
                  md
                </Button>
                <Button color="primary" size="sm">
                  sm
                </Button>
                <Button color="primary" size="xs">
                  xs
                </Button>
              </div>
            </div>

            {/* Icon 기준 */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Icon + Text 기준
              </h3>
              <div className="flex gap-2 items-center flex-wrap">
                <Button color="primary">
                  <FiGithub />
                  GITHUB
                </Button>
              </div>
            </div>

            {/* IconOnly 기준 */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                IconOnly 기준
              </h3>
              <div className="flex gap-4 items-center flex-wrap">
                <Button color="primary" size="lg" iconOnly>
                  <FaHeart />
                </Button>
                <Button color="primary" size="md" iconOnly>
                  <FaHeart />
                </Button>
                <Button color="primary" size="sm" iconOnly>
                  <FaHeart />
                </Button>
                <Button color="primary" size="xs" iconOnly>
                  <FaHeart />
                </Button>
              </div>
            </div>

            {/* Click 이벤트 핸들러 */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Click 이벤트 핸들러
              </h3>
              <div className="flex gap-2 items-center flex-wrap">
                <Button color="primary" onClick={() => alert('click')}>
                  클릭 시 alert
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TextField 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            TextField 컴포넌트
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                Input 타입별, Textarea 컴포넌트
              </h3>
              <div className="space-y-4">
                <TextField label="TextField label" htmlFor="textFieldInput">
                  <TextInput
                    type="text"
                    placeholder="input placeholder"
                    id="textFieldInput"
                  />
                </TextField>
                <TextField label="password input" htmlFor="passwordInput">
                  <TextInput
                    type="password"
                    placeholder="password 입력해주세요"
                    id="passwordInput"
                  />
                </TextField>
                <TextField label="textarea 필드" htmlFor="textareaInput">
                  <Textarea
                    placeholder="textarea 입력해주세요"
                    id="textareaInput"
                  />
                </TextField>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                onChange 이벤트 핸들러
              </h3>
              <TextField label="input 필드" htmlFor="inputOnChange">
                <TextInput
                  placeholder="input 입력 시 console.log 출력"
                  onChange={(e) => console.log(e.target.value)}
                  id="inputOnChange"
                />
              </TextField>
            </div>
          </div>
        </section>

        {/* Card 테스트 */}
        <section className="mb-12 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Card 컴포넌트
          </h2>
          <Card>
            <p className="text-foreground">카드 컴포넌트</p>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos.
              <br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            </p>
          </Card>
        </section>

        {/* Galaxy Systems 테스트 */}
        <section className="mb-12 p-6 border rounded-lg h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Galaxy Systems 컴포넌트
          </h2>
          <GalaxySystemIndex />
        </section>
      </div>
    </div>
  );
};

export default ComponentTestPage;
