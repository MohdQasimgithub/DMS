package com.hyundai.dms.common.config;

import com.hyundai.dms.domain.config.entity.AppConfig;
import com.hyundai.dms.domain.config.repository.AppConfigRepository;
import com.hyundai.dms.domain.dealer.entity.Dealer;
import com.hyundai.dms.domain.dealer.repository.DealerRepository;
import com.hyundai.dms.domain.enquiry.entity.Enquiry;
import com.hyundai.dms.domain.enquiry.repository.EnquiryRepository;
import com.hyundai.dms.domain.menu.entity.Menu;
import com.hyundai.dms.domain.menu.repository.MenuRepository;
import com.hyundai.dms.domain.role.entity.Role;
import com.hyundai.dms.domain.role.repository.RoleRepository;
import com.hyundai.dms.domain.testdrive.entity.TestDrive;
import com.hyundai.dms.domain.testdrive.repository.TestDriveRepository;
import com.hyundai.dms.domain.user.entity.User;
import com.hyundai.dms.domain.user.repository.UserRepository;
import com.hyundai.dms.domain.vehicle.entity.Vehicle;
import com.hyundai.dms.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MenuRepository menuRepository;
    private final DealerRepository dealerRepository;
    private final VehicleRepository vehicleRepository;
    private final TestDriveRepository testDriveRepository;
    private final EnquiryRepository enquiryRepository;
    private final AppConfigRepository configRepository;
    private final PasswordEncoder passwordEncoder;

    // ── master data ──────────────────────────────────────────────────────────
    private static final String[][] REGIONS = {
        {"Seoul",   "Seoul"},   {"Busan",    "Busan"},
        {"Incheon", "Incheon"}, {"Daegu",    "Daegu"},
        {"Gwangju", "Gwangju"}, {"Daejeon",  "Daejeon"},
        {"Ulsan",   "Ulsan"},   {"Suwon",    "Gyeonggi"},
        {"Goyang",  "Gyeonggi"},{"Changwon", "Gyeongnam"},
        {"Jeonju",  "Jeonbuk"}, {"Cheongju", "Chungbuk"},
        {"Pohang",  "Gyeongbuk"},{"Jeju",    "Jeju"}
    };

    private static final String[][] MODELS = {
        {"IONIQ 6",   new String[]{"Standard Range","Long Range RWD","Long Range AWD"}[0],
                      "Standard Range"},
        {"IONIQ 5",   "Standard Range", "Long Range RWD"},
        {"Tucson",    "Petrol 2.0",     "Hybrid"},
        {"Santa Fe",  "Petrol 2.5",     "Hybrid"},
        {"Sonata",    "Petrol 2.0",     "Hybrid"},
        {"Elantra",   "Petrol 1.6",     "N Line"},
        {"Kona",      "Petrol 1.0T",    "Electric"},
        {"Palisade",  "Petrol 3.8",     "Diesel 2.2"},
        {"Staria",    "Petrol 3.5",     "Diesel 2.2"},
        {"Venue",     "Petrol 1.0T",    "Petrol 1.6"},
    };

    private static final String[] VARIANTS_IONIQ6  = {"Standard Range","Long Range RWD","Long Range AWD"};
    private static final String[] VARIANTS_IONIQ5  = {"Standard Range","Long Range RWD","Long Range AWD"};
    private static final String[] VARIANTS_TUCSON  = {"Petrol 2.0","Diesel 2.0","Hybrid","PHEV"};
    private static final String[] VARIANTS_SANTAFE = {"Petrol 2.5","Diesel 2.2","Hybrid","PHEV"};
    private static final String[] VARIANTS_SONATA  = {"Petrol 2.0","Hybrid","N Line"};
    private static final String[] VARIANTS_ELANTRA = {"Petrol 1.6","Hybrid","N Line"};
    private static final String[] VARIANTS_KONA    = {"Petrol 1.0T","Petrol 1.6","Electric"};
    private static final String[] VARIANTS_PALISADE= {"Petrol 3.8","Diesel 2.2"};
    private static final String[] VARIANTS_STARIA  = {"Petrol 3.5","Diesel 2.2"};
    private static final String[] VARIANTS_VENUE   = {"Petrol 1.0T","Petrol 1.6"};

    private static final String[] COLORS = {
        "Phantom Black","Ceramic White","Gravity Gold Matte","Nocturne Blue",
        "Digital Teal","Cyber Grey","Atlas White","Shooting Star",
        "Magnetic Force","Shimmering Silver","Serenity White","Sonic Blue",
        "Abyss Black","Moonlight Cloud","Stormy Sea","Performance Blue"
    };

    private static final String[] FIRST_NAMES = {
        "Kim","Lee","Park","Choi","Jung","Kang","Yoon","Lim",
        "Han","Oh","Shin","Kwon","Jang","Hong","Ko","Moon",
        "Bae","Ryu","Ahn","Song","Nam","Hwang","Seo","Jeon"
    };
    private static final String[] LAST_NAMES = {
        "Jae-won","Min-jun","Soo-yeon","Hyun-soo","Da-eun","Ji-ho",
        "Tae-yang","Bo-ra","Cheol-su","Na-ra","Seung-hwan","Hye-jin",
        "Dong-hyun","Ji-yeon","Sang-woo","Mi-rae","Joon-ho","Ye-jin",
        "Woo-jin","So-yeon","Byung-chul","Eun-ji","Kyung-min","Ha-eun"
    };

    @Override
    @Transactional
    public void run(String... args) {
        seedMenus();
        seedRoles();
        seedUsers();
        seedDealers();
        seedVehicles();
        seedTestDrives();
        seedEnquiries();
        seedConfigs();
        log.info("✅ Seeding done — users:{}, dealers:{}, vehicles:{}",
                userRepository.count(), dealerRepository.count(), vehicleRepository.count());
    }

    // ── MENUS ────────────────────────────────────────────────────────────────

    private void seedMenus() {
        if (menuRepository.count() > 0) return;
        Menu dash  = m("DASHBOARD","Dashboard","/dashboard","dashboard",1,null);
        Menu deal  = m("DEALERS","Dealers","/dealers","store",2,null);
        Menu veh   = m("VEHICLES","Vehicles","/vehicles","directions_car",3,null);
        Menu adm   = m("ADMIN","Administration",null,"admin_panel_settings",4,null);
        m("USERS","Users","/admin/users","people",1,adm);
        m("ROLES","Roles","/admin/roles","security",2,adm);
        m("MENUS","Menus","/admin/menus","menu",3,adm);
        m("CONFIGS","Configurations","/admin/configs","settings",4,adm);
        m("LOGS","Logs","/admin/logs","article",5,adm);
        log.info("Menus seeded.");
    }

    private Menu m(String code,String name,String url,String icon,int order,Menu parent){
        return menuRepository.save(Menu.builder()
                .menuCode(code).menuName(name).url(url).icon(icon)
                .sortOrder(order).parent(parent).build());
    }

    // ── ROLES ────────────────────────────────────────────────────────────────

    private void seedRoles() {
        if (roleRepository.count() > 0) return;
        List<Menu> all      = menuRepository.findAll();
        List<Menu> limited  = all.stream()
                .filter(x -> List.of("DASHBOARD","DEALERS","VEHICLES").contains(x.getMenuCode()))
                .toList();

        roleRepository.save(Role.builder().roleName("ADMIN")
                .description("Full system access").menus(Set.copyOf(all)).build());
        roleRepository.save(Role.builder().roleName("DEALER")
                .description("Dealer — manage own dealership & vehicles")
                .menus(Set.copyOf(limited)).build());
        roleRepository.save(Role.builder().roleName("EMPLOYEE")
                .description("Employee — sales & support staff")
                .menus(Set.copyOf(limited)).build());
        log.info("Roles seeded: ADMIN, DEALER, EMPLOYEE");
    }

    // ── USERS  (50 users) ────────────────────────────────────────────────────

    private void seedUsers() {
        if (userRepository.count() > 0) return;
        Role admin    = roleRepository.findByRoleName("ADMIN").orElseThrow();
        Role dealer   = roleRepository.findByRoleName("DEALER").orElseThrow();
        Role employee = roleRepository.findByRoleName("EMPLOYEE").orElseThrow();

        List<User> users = new ArrayList<>();

        // 1 admin
        users.add(User.builder().username("admin")
                .email("admin@hyundai-autoever.com")
                .password(passwordEncoder.encode("Admin@1234"))
                .fullName("System Administrator").phoneNumber("01012345678")
                .roles(Set.of(admin)).build());

        // 20 dealers
        for (int i = 1; i <= 20; i++) {
            String fn = FIRST_NAMES[i % FIRST_NAMES.length];
            String ln = LAST_NAMES[i % LAST_NAMES.length];
            users.add(User.builder()
                    .username("dealer_" + String.format("%02d", i))
                    .email("dealer" + i + "@hyundai-dealer.com")
                    .password(passwordEncoder.encode("Dealer@1234"))
                    .fullName(fn + " " + ln)
                    .phoneNumber("010" + String.format("%08d", 10000000 + i))
                    .roles(Set.of(dealer)).build());
        }

        // 25 employees
        for (int i = 1; i <= 25; i++) {
            String fn = FIRST_NAMES[(i + 5) % FIRST_NAMES.length];
            String ln = LAST_NAMES[(i + 5) % LAST_NAMES.length];
            users.add(User.builder()
                    .username("emp_" + String.format("%02d", i))
                    .email("employee" + i + "@hyundai-autoever.com")
                    .password(passwordEncoder.encode("Employee@1234"))
                    .fullName(fn + " " + ln)
                    .phoneNumber("010" + String.format("%08d", 20000000 + i))
                    .roles(Set.of(employee)).build());
        }

        // 4 multi-role users (dealer + employee)
        for (int i = 1; i <= 4; i++) {
            users.add(User.builder()
                    .username("mgr_" + String.format("%02d", i))
                    .email("manager" + i + "@hyundai.com")
                    .password(passwordEncoder.encode("Manager@1234"))
                    .fullName("Manager " + LAST_NAMES[i])
                    .phoneNumber("010" + String.format("%08d", 30000000 + i))
                    .roles(Set.of(dealer, employee)).build());
        }

        userRepository.saveAll(users);
        log.info("Users seeded: {} total", users.size());
    }

    // ── DEALERS  (50 dealers) ────────────────────────────────────────────────

    private void seedDealers() {
        if (dealerRepository.count() > 0) return;
        List<Dealer> dealers = new ArrayList<>();

        String[] streets = {
            "Gangnam-daero","Teheran-ro","Sejong-daero","Jongno","Eulji-ro",
            "Dobong-ro","Haeundae-ro","Sasang-ro","Airport-ro","Dongseong-ro",
            "Chungjang-ro","Dunsan-ro","Taehwa-ro","Jungang-ro","Bupyeong-ro"
        };
        String[] managers = {
            "Kim Jae-won","Park Min-jun","Lee Soo-yeon","Choi Hyun-soo","Jung Da-eun",
            "Kang Ji-ho","Yoon Tae-yang","Lim Bo-ra","Han Cheol-su","Oh Na-ra",
            "Shin Seung-hwan","Kwon Hye-jin","Jang Dong-hyun","Hong Ji-yeon","Ko Sang-woo"
        };
        Dealer.DealerStatus[] statuses = {
            Dealer.DealerStatus.ACTIVE, Dealer.DealerStatus.ACTIVE,
            Dealer.DealerStatus.ACTIVE, Dealer.DealerStatus.ACTIVE,
            Dealer.DealerStatus.INACTIVE, Dealer.DealerStatus.SUSPENDED
        };

        // Use a global sequential number for unique dealer codes
        int globalSeq = 1;

        for (String[] region : REGIONS) {
            String city = region[0];
            String reg  = region[1];
            int count   = (reg.equals("Seoul") || reg.equals("Gyeonggi")) ? 6 : 3;

            for (int i = 1; i <= count; i++) {
                // Globally unique code: HYD-001, HYD-002, ...
                String code    = String.format("HYD-%03d", globalSeq);
                String street  = streets[(globalSeq - 1) % streets.length];
                String manager = managers[(globalSeq - 1) % managers.length];
                Dealer.DealerStatus status = statuses[(globalSeq - 1) % statuses.length];

                dealers.add(Dealer.builder()
                        .dealerCode(code)
                        .dealerName("Hyundai " + city + " " + suffix(i))
                        .address(globalSeq * 10 + " " + street + ", " + city)
                        .city(city).region(reg)
                        .phone("0" + (2 + globalSeq % 8) + String.format("%07d", globalSeq))
                        .email(city.toLowerCase().replaceAll("\\s+","") + i + "@hyundai-dealer.com")
                        .managerName(manager)
                        .status(status)
                        .build());
                globalSeq++;
            }
        }

        dealerRepository.saveAll(dealers);
        log.info("Dealers seeded: {}", dealers.size());
    }

    private String suffix(int i) {
        return switch (i) {
            case 1 -> "Central";  case 2 -> "North";   case 3 -> "South";
            case 4 -> "East";     case 5 -> "West";     default -> "Premium";
        };
    }

    // ── VEHICLES  (200+ vehicles) ────────────────────────────────────────────

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;
        List<Dealer> dealers = dealerRepository.findAll();
        List<Vehicle> vehicles = new ArrayList<>();

        // model → variants, base price
        record ModelSpec(String model, String[] variants, long basePrice) {}
        List<ModelSpec> specs = List.of(
            new ModelSpec("IONIQ 6",  VARIANTS_IONIQ6,   38_000_000L),
            new ModelSpec("IONIQ 5",  VARIANTS_IONIQ5,   42_000_000L),
            new ModelSpec("Tucson",   VARIANTS_TUCSON,   27_000_000L),
            new ModelSpec("Santa Fe", VARIANTS_SANTAFE,  38_000_000L),
            new ModelSpec("Sonata",   VARIANTS_SONATA,   24_000_000L),
            new ModelSpec("Elantra",  VARIANTS_ELANTRA,  20_000_000L),
            new ModelSpec("Kona",     VARIANTS_KONA,     22_000_000L),
            new ModelSpec("Palisade", VARIANTS_PALISADE, 50_000_000L),
            new ModelSpec("Staria",   VARIANTS_STARIA,   40_000_000L),
            new ModelSpec("Venue",    VARIANTS_VENUE,    18_000_000L)
        );

        Vehicle.VehicleStatus[] statuses = Vehicle.VehicleStatus.values();
        int vinSeq = 1;

        for (ModelSpec spec : specs) {
            // ~22 vehicles per model = ~220 total
            for (int i = 0; i < 22; i++) {
                String variant = spec.variants()[i % spec.variants().length];
                String color   = COLORS[i % COLORS.length];
                int year       = 2022 + (i % 3);   // 2022, 2023, 2024
                long priceAdj  = spec.basePrice() + (long)(i % spec.variants().length) * 3_000_000L;
                Vehicle.VehicleStatus status = statuses[i % statuses.length];
                Dealer dealer  = dealers.get(i % dealers.size());

                String vin = String.format("KMHC041DBNU%06d", vinSeq++);

                vehicles.add(Vehicle.builder()
                        .vin(vin)
                        .model(spec.model())
                        .variant(variant)
                        .color(color)
                        .modelYear(year)
                        .price(BigDecimal.valueOf(priceAdj))
                        .status(status)
                        .dealer(dealer)
                        .build());
            }
        }

        vehicleRepository.saveAll(vehicles);
        log.info("Vehicles seeded: {}", vehicles.size());
    }

    // ── CONFIGS ──────────────────────────────────────────────────────────────

    private void seedConfigs() {
        if (configRepository.count() > 0) return;
        configRepository.saveAll(List.of(
            cfg("MAX_LOGIN_ATTEMPTS",      "5",                          "SECURITY", "Max failed attempts before lock"),
            cfg("SESSION_TIMEOUT_MINUTES", "30",                         "SECURITY", "JWT session timeout (minutes)"),
            cfg("PASSWORD_MIN_LENGTH",     "8",                          "SECURITY", "Minimum password length"),
            cfg("ITEMS_PER_PAGE",          "10",                         "UI",       "Default pagination size"),
            cfg("DATE_FORMAT",             "yyyy-MM-dd",                 "UI",       "Display date format"),
            cfg("CURRENCY",                "KRW",                        "UI",       "Default currency"),
            cfg("APP_NAME",                "Hyundai AutoEver DMS",       "SYSTEM",   "Application display name"),
            cfg("APP_VERSION",             "1.0.0",                      "SYSTEM",   "Application version"),
            cfg("SUPPORT_EMAIL",           "support@hyundai-autoever.com","SYSTEM",  "Support contact email"),
            cfg("MAINTENANCE_MODE",        "false",                      "SYSTEM",   "Toggle maintenance mode")
        ));
        log.info("Configs seeded.");
    }

    private AppConfig cfg(String key, String val, String group, String desc) {
        boolean editable = !"APP_VERSION".equals(key);
        return AppConfig.builder()
                .configKey(key).configValue(val)
                .configGroup(group).description(desc)
                .editable(editable).build();
    }

    // ── TEST DRIVES ──────────────────────────────────────────────────────────

    private void seedTestDrives() {
        if (testDriveRepository.count() > 0) return;

        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Dealer>  dealers  = dealerRepository.findAll();

        String[][] customers = {
            {"Kim Jae-won",   "01012345001", "jaewon.kim@gmail.com"},
            {"Park Min-jun",  "01012345002", "minjun.park@naver.com"},
            {"Lee Soo-yeon",  "01012345003", "sooyeon.lee@kakao.com"},
            {"Choi Hyun-soo", "01012345004", "hyunsoo.choi@gmail.com"},
            {"Jung Da-eun",   "01012345005", "daeun.jung@naver.com"},
            {"Kang Ji-ho",    "01012345006", "jiho.kang@gmail.com"},
            {"Yoon Tae-yang", "01012345007", "taeyang.yoon@kakao.com"},
            {"Lim Bo-ra",     "01012345008", "bora.lim@gmail.com"},
            {"Han Cheol-su",  "01012345009", "cheolsu.han@naver.com"},
            {"Oh Na-ra",      "01012345010", "nara.oh@gmail.com"},
            {"Shin Seung-hwan","01012345011","seunghwan.shin@kakao.com"},
            {"Kwon Hye-jin",  "01012345012", "hyejin.kwon@gmail.com"},
            {"Jang Dong-hyun","01012345013", "donghyun.jang@naver.com"},
            {"Hong Ji-yeon",  "01012345014", "jiyeon.hong@gmail.com"},
            {"Ko Sang-woo",   "01012345015", "sangwoo.ko@kakao.com"},
            {"Moon Mi-rae",   "01012345016", "mirae.moon@gmail.com"},
            {"Bae Joon-ho",   "01012345017", "joonho.bae@naver.com"},
            {"Ryu Ye-jin",    "01012345018", "yejin.ryu@gmail.com"},
            {"Ahn Woo-jin",   "01012345019", "woojin.ahn@kakao.com"},
            {"Song So-yeon",  "01012345020", "soyeon.song@gmail.com"},
            {"Nam Byung-chul","01012345021", "byungchul.nam@naver.com"},
            {"Hwang Eun-ji",  "01012345022", "eunji.hwang@gmail.com"},
            {"Seo Kyung-min", "01012345023", "kyungmin.seo@kakao.com"},
            {"Jeon Ha-eun",   "01012345024", "haeun.jeon@gmail.com"},
            {"Im Sung-jin",   "01012345025", "sungjin.im@naver.com"},
        };

        TestDrive.TestDriveStatus[] statuses = TestDrive.TestDriveStatus.values();
        String[] times = {"09:00","10:00","11:00","13:00","14:00","15:00","16:00"};
        String[] notes = {
            "Customer interested in electric range",
            "Comparing with competitor model",
            "First time Hyundai buyer",
            "Upgrading from older model",
            "Corporate fleet inquiry",
            "Interested in financing options",
            null, null
        };

        List<TestDrive> list = new ArrayList<>();
        for (int i = 0; i < customers.length; i++) {
            Vehicle v = vehicles.get(i % vehicles.size());
            Dealer  d = dealers.get(i % dealers.size());
            TestDrive.TestDriveStatus status = i < 10 ? TestDrive.TestDriveStatus.SCHEDULED
                    : i < 17 ? TestDrive.TestDriveStatus.COMPLETED
                    : i < 22 ? TestDrive.TestDriveStatus.CANCELLED
                    : TestDrive.TestDriveStatus.NO_SHOW;

            list.add(TestDrive.builder()
                    .customerName(customers[i][0])
                    .customerPhone(customers[i][1])
                    .customerEmail(customers[i][2])
                    .scheduledDate(java.time.LocalDate.now().plusDays(i - 5))
                    .scheduledTime(java.time.LocalTime.parse(times[i % times.length]))
                    .notes(notes[i % notes.length])
                    .status(status)
                    .vehicle(v)
                    .dealer(d)
                    .build());
        }
        testDriveRepository.saveAll(list);
        log.info("Test drives seeded: {}", list.size());
    }

    // ── ENQUIRIES ────────────────────────────────────────────────────────────

    private void seedEnquiries() {
        if (enquiryRepository.count() > 0) return;

        List<Vehicle> vehicles = vehicleRepository.findAll();
        List<Dealer>  dealers  = dealerRepository.findAll();

        Object[][] enquiryData = {
            {"Kim Min-su",    "01098760001", "minsu.kim@gmail.com",   Enquiry.EnquiryType.PURCHASE,   "I am interested in buying the IONIQ 6 Long Range. What are the available colors and financing options?",   Enquiry.EnquiryStatus.NEW},
            {"Lee Ji-young",  "01098760002", "jiyoung.lee@naver.com", Enquiry.EnquiryType.TEST_DRIVE, "Would like to schedule a test drive for the Tucson Hybrid this weekend.",                                   Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Park Sung-ho",  "01098760003", "sungho.park@kakao.com", Enquiry.EnquiryType.FINANCING,  "What financing plans are available for the Santa Fe? I am looking for 48-month installment.",              Enquiry.EnquiryStatus.NEW},
            {"Choi Yeon-ji",  "01098760004", "yeonji.choi@gmail.com", Enquiry.EnquiryType.PURCHASE,   "Interested in Sonata N Line. Is the Sonic Blue color available at your Seoul branch?",                    Enquiry.EnquiryStatus.RESOLVED},
            {"Jung Woo-seok", "01098760005", "wooseok.jung@naver.com",Enquiry.EnquiryType.SERVICE,    "My Elantra needs a 60,000km service. Can I book an appointment for next Monday?",                         Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Kang Hee-jin",  "01098760006", "heejin.kang@gmail.com", Enquiry.EnquiryType.PURCHASE,   "Looking for IONIQ 5 AWD in Phantom Black. What is the current waiting period?",                          Enquiry.EnquiryStatus.NEW},
            {"Yoon Jae-hyun", "01098760007", "jaehyun.yoon@kakao.com",Enquiry.EnquiryType.TEST_DRIVE, "Can I test drive the Palisade Diesel? I have a family of 6 and need a large SUV.",                       Enquiry.EnquiryStatus.RESOLVED},
            {"Lim Soo-bin",   "01098760008", "soobin.lim@gmail.com",  Enquiry.EnquiryType.GENERAL,    "What is the difference between IONIQ 5 and IONIQ 6? Which one is better for highway driving?",           Enquiry.EnquiryStatus.RESOLVED},
            {"Han Dong-jun",  "01098760009", "dongjun.han@naver.com", Enquiry.EnquiryType.PURCHASE,   "I want to buy a Kona Electric for city commuting. What is the real-world range?",                        Enquiry.EnquiryStatus.NEW},
            {"Oh Soo-jin",    "01098760010", "soojin.oh@gmail.com",   Enquiry.EnquiryType.FINANCING,  "Is there a zero-interest financing option for the Tucson PHEV?",                                          Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Shin Byung-ho", "01098760011", "byungho.shin@kakao.com",Enquiry.EnquiryType.SERVICE,    "Need to replace brake pads on my 2022 Santa Fe. How much does it cost?",                                  Enquiry.EnquiryStatus.CLOSED},
            {"Kwon Ye-seul",  "01098760012", "yeseul.kwon@gmail.com", Enquiry.EnquiryType.PURCHASE,   "Interested in Staria for family use. Does it come with a sunroof option?",                               Enquiry.EnquiryStatus.NEW},
            {"Jang Hyun-woo", "01098760013", "hyunwoo.jang@naver.com",Enquiry.EnquiryType.TEST_DRIVE, "Would like to test drive the Venue. I am a first-time car buyer.",                                       Enquiry.EnquiryStatus.NEW},
            {"Hong Soo-yeon", "01098760014", "sooyeon.hong@gmail.com",Enquiry.EnquiryType.PURCHASE,   "Looking for a corporate fleet deal for 10 Sonata Hybrids. Please contact me.",                           Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Ko Ji-min",     "01098760015", "jimin.ko@kakao.com",    Enquiry.EnquiryType.GENERAL,    "What government subsidies are available for electric vehicles in Seoul?",                                  Enquiry.EnquiryStatus.RESOLVED},
            {"Moon Tae-jun",  "01098760016", "taejun.moon@gmail.com", Enquiry.EnquiryType.PURCHASE,   "I want to trade in my 2020 Tucson and upgrade to the new Santa Fe Hybrid.",                              Enquiry.EnquiryStatus.NEW},
            {"Bae Eun-soo",   "01098760017", "eunsoo.bae@naver.com",  Enquiry.EnquiryType.SERVICE,    "My IONIQ 5 battery warning light is on. Is this covered under warranty?",                                Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Ryu Sang-min",  "01098760018", "sangmin.ryu@gmail.com", Enquiry.EnquiryType.TEST_DRIVE, "Can I test drive the IONIQ 6 AWD? I want to compare it with the RWD version.",                          Enquiry.EnquiryStatus.RESOLVED},
            {"Ahn Ji-soo",    "01098760019", "jisoo.ahn@kakao.com",   Enquiry.EnquiryType.FINANCING,  "What is the monthly installment for Palisade Petrol over 60 months?",                                    Enquiry.EnquiryStatus.NEW},
            {"Song Hyun-ji",  "01098760020", "hyunji.song@gmail.com", Enquiry.EnquiryType.PURCHASE,   "Is the Elantra N Line available in Performance Blue at Busan branch?",                                   Enquiry.EnquiryStatus.RESOLVED},
            {"Nam Woo-hyun",  "01098760021", "woohyun.nam@naver.com", Enquiry.EnquiryType.GENERAL,    "What is the warranty period for Hyundai electric vehicles?",                                             Enquiry.EnquiryStatus.CLOSED},
            {"Hwang So-ra",   "01098760022", "sora.hwang@gmail.com",  Enquiry.EnquiryType.PURCHASE,   "Looking for Kona Electric in Cyber Grey. What is the delivery timeline?",                               Enquiry.EnquiryStatus.NEW},
            {"Seo Joon-young","01098760023", "joonyoung.seo@kakao.com",Enquiry.EnquiryType.SERVICE,   "Need full car inspection before long road trip. Can I book for this Saturday?",                          Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Jeon Min-kyung","01098760024", "minkyung.jeon@gmail.com",Enquiry.EnquiryType.TEST_DRIVE,"I would like to test drive the Tucson Hybrid and PHEV back to back.",                                    Enquiry.EnquiryStatus.IN_PROGRESS},
            {"Im Hae-won",    "01098760025", "haewon.im@naver.com",   Enquiry.EnquiryType.FINANCING,  "Can I get pre-approval for a car loan before visiting the showroom?",                                    Enquiry.EnquiryStatus.NEW},
        };

        List<Enquiry> list = new ArrayList<>();
        for (int i = 0; i < enquiryData.length; i++) {
            Object[] row = enquiryData[i];
            Vehicle v = i < vehicles.size() ? vehicles.get(i) : vehicles.get(i % vehicles.size());
            Dealer  d = dealers.get(i % dealers.size());

            list.add(Enquiry.builder()
                    .customerName((String) row[0])
                    .customerPhone((String) row[1])
                    .customerEmail((String) row[2])
                    .enquiryType((Enquiry.EnquiryType) row[3])
                    .message((String) row[4])
                    .status((Enquiry.EnquiryStatus) row[5])
                    .vehicle(v)
                    .dealer(d)
                    .build());
        }
        enquiryRepository.saveAll(list);
        log.info("Enquiries seeded: {}", list.size());
    }
}
