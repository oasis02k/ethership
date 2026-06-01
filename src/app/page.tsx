const imgLogo =
  'https://www.figma.com/api/mcp/asset/809dbe26-5b17-410d-bdfb-b7a2a006a3c0';
const imgGridPattern =
  'https://www.figma.com/api/mcp/asset/16f1f464-edaa-4e9c-89e1-32d673db1935';

const images = {
  aq37461:             'https://www.figma.com/api/mcp/asset/5cb56e8c-a423-40f1-a487-7dd7403983f8',
  nx43361:             'https://www.figma.com/api/mcp/asset/425c3d56-240e-4560-8b7e-eb6ff46ccee9',
  jejo:                'https://www.figma.com/api/mcp/asset/1d318e4b-42e5-4491-a792-4b29464abdcc',
  perspectiveEntrance: 'https://www.figma.com/api/mcp/asset/96d312a5-0b4c-48b4-a558-4aee6819e559',
  jinjumuseum:         'https://www.figma.com/api/mcp/asset/38ec2504-f8ed-41ea-9a01-28d7fa25955e',
  sen230:              'https://www.figma.com/api/mcp/asset/3af5df27-2268-4895-8521-bc026805f4e2',
  yeonsu:              'https://www.figma.com/api/mcp/asset/12d90af3-079f-4536-8d9a-446fb2689817',
  aerialView:          'https://www.figma.com/api/mcp/asset/2615a17b-0e3a-4f73-bcec-fbec9b8819a3',
  projectPreview:      'https://www.figma.com/api/mcp/asset/573a2074-20de-4212-97a6-6c39fc36ac99',
  perspective01:       'https://www.figma.com/api/mcp/asset/66b84692-0747-426f-aa17-07c29d32491f',
  ie43063:             'https://www.figma.com/api/mcp/asset/042eae63-6405-4173-ac0d-e9e6f5fa86f4',
  sa28564:             'https://www.figma.com/api/mcp/asset/f2146b1f-eb3b-4c2e-b53b-c6e7d72a7fa7',
};

function NavBar() {
  return (
    <nav className="absolute top-4 left-6 right-6 h-14 bg-[#2e2e2b] rounded-[4px] flex items-center px-6 z-10">
      <div className="flex flex-1 items-center justify-between">
        <div className="relative h-4 w-[168px] shrink-0">
          <img
            alt="Ether Ship"
            className="absolute inset-0 h-full w-full object-contain object-left"
            src={imgLogo}
          />
        </div>
        <span className="font-medium text-[#f6f4ee] text-[18px] tracking-[-0.36px] whitespace-nowrap">
          MENU
        </span>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("${imgGridPattern}")`,
          backgroundSize: '136px 136px',
          backgroundPosition: 'top left',
        }}
      />

      <NavBar />

      {/* Image strip */}
      <div
        className="absolute"
        style={{ left: '-790px', top: '103px', width: '3379px', height: '880px' }}
      >
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.ie43063}
          style={{ left: '51px',   top: '32px',  width: '396px', height: '308px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.jinjumuseum}
          style={{ left: '519px',  top: '32px',  width: '510px', height: '282px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.perspectiveEntrance}
          style={{ left: '1100px', top: '51px',  width: '433px', height: '243px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.aq37461}
          style={{ left: '1649px', top: '14px',  width: '323px', height: '418px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.nx43361}
          style={{ left: '2028px', top: '32px',  width: '489px', height: '326px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.perspective01}
          style={{ left: '2573px', top: '89px',  width: '654px', height: '308px' }} />
        <img alt="" className="absolute object-cover" src={images.sen230}
          style={{ left: '0px',    top: '383px', width: '373px', height: '373px' }} />
        <img alt="" className="absolute object-cover" src={images.yeonsu}
          style={{ left: '457px',  top: '434px', width: '500px', height: '281px' }} />
        <img alt="" className="absolute object-cover" src={images.aerialView}
          style={{ left: '997px',  top: '465px', width: '595px', height: '335px' }} />
        <img alt="" className="absolute object-cover" src={images.jejo}
          style={{ left: '1676px', top: '551px', width: '464px', height: '261px' }} />
        <img alt="" className="absolute object-cover" src={images.projectPreview}
          style={{ left: '2214px', top: '465px', width: '442px', height: '371px' }} />
        <img alt="" className="absolute rounded-[4px] object-cover" src={images.sa28564}
          style={{ left: '2850px', top: '434px', width: '265px', height: '446px' }} />
      </div>
    </div>
  );
}
