import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import TextField from '@/components/ui/TextField';
import Textarea from '@/components/ui/Textarea';

const sectionStyle =
  'p-4 border-solid border-[1px] border-border-white rounded-[8px]';

export default function ComponentsPage() {
  return (
    <div className="p-4 bg-[#222222] h-[100vh] overflow-y-auto text-text-secondary">
      <h1>컴포넌트 페이지</h1>

      <br />
      <br />

      <section className={sectionStyle}>
        <h2>&lt;버튼&gt;</h2>
        <h3>variant 기준</h3>
        <div className="flex gap-4 align-center">
          <Button color="primary">primary</Button>
          <Button color="secondary">secondary</Button>
          <Button color="tertiary">tertiary</Button>
        </div>
        <h2>size 기준</h2>
        <div className="flex gap-4 align-center">
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

        <h2>icon 기준</h2>
        <div className="flex gap-2 align-center">
          <Button color="primary">
            <img
              src="/dummy/github.svg"
              alt="깃헙 아이콘"
              style={{ width: '20px', height: '20px' }}
            />
            GITHUB
          </Button>
        </div>
        <h2>click 이벤트 핸들러 추가</h2>
        <div className="flex gap-2 align-center">
          <Button color="primary" onClick={() => alert('click')}>
            클릭 시 alert
          </Button>
        </div>
      </section>

      <br />
      <br />

      <section className={sectionStyle}>
        <h2>&lt;텍스트필드&gt;</h2>
        <h3>input 타입 별, textarea 컴포넌트</h3>
        <div className="">
          <TextField label="textFiled label" htmlFor="textFiledInput">
            <Input
              type="text"
              placeholder="input placeholder"
              id="textFiledInput"
            />
          </TextField>
          <TextField label="password input" htmlFor="passwordInput">
            <Input
              type="password"
              placeholder="password 입력해주세요"
              id="passwordInput"
            />
          </TextField>
          <TextField label="textarea 필드" htmlFor="textareaInput">
            <Textarea placeholder="textarea 입력해주세요" id="textareaInput" />
          </TextField>
        </div>

        <h3>onChange 이벤트 핸들러 추가</h3>
        <TextField label="input 필드" htmlFor="inputOnChange">
          <Input
            placeholder="input 입력 시 console.log 출력"
            onChange={(e) => console.log(e.target.value)}
            id="inputOnChange"
          />
        </TextField>
      </section>

      <br />
      <br />

      <section className={sectionStyle}>
        <h2>&lt;카드&gt;</h2>
        <Card>
          <p>카드 컴포넌트</p>
          <p>
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
    </div>
  );
}
