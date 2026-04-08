package com.hyundai.dms.domain.menu.service;

import com.hyundai.dms.common.exception.DuplicateResourceException;
import com.hyundai.dms.common.exception.ResourceNotFoundException;
import com.hyundai.dms.domain.menu.dto.MenuRequest;
import com.hyundai.dms.domain.menu.dto.MenuResponse;
import com.hyundai.dms.domain.menu.entity.Menu;
import com.hyundai.dms.domain.menu.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenuTree() {
        return menuRepository.findRootMenus().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getAll() {
        return menuRepository.findAll().stream()
                .map(this::toResponseFlat)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MenuResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public MenuResponse create(MenuRequest request) {
        if (menuRepository.existsByMenuCode(request.getMenuCode())) {
            throw new DuplicateResourceException("Menu code already exists: " + request.getMenuCode());
        }
        Menu menu = Menu.builder()
                .menuCode(request.getMenuCode())
                .menuName(request.getMenuName())
                .url(request.getUrl())
                .icon(request.getIcon())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        if (request.getParentId() != null) {
            menu.setParent(findById(request.getParentId()));
        }
        return toResponse(menuRepository.save(menu));
    }

    @Transactional
    public MenuResponse update(Long id, MenuRequest request) {
        Menu menu = findById(id);
        if (!menu.getMenuCode().equals(request.getMenuCode()) &&
                menuRepository.existsByMenuCode(request.getMenuCode())) {
            throw new DuplicateResourceException("Menu code already exists: " + request.getMenuCode());
        }
        menu.setMenuCode(request.getMenuCode());
        menu.setMenuName(request.getMenuName());
        menu.setUrl(request.getUrl());
        menu.setIcon(request.getIcon());
        if (request.getSortOrder() != null) menu.setSortOrder(request.getSortOrder());
        if (request.getParentId() != null) {
            menu.setParent(findById(request.getParentId()));
        } else {
            menu.setParent(null);
        }
        return toResponse(menuRepository.save(menu));
    }

    @Transactional
    public void delete(Long id) {
        Menu menu = findById(id);
        menu.setActive(false);
        menuRepository.save(menu);
    }

    private Menu findById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu", id));
    }

    private MenuResponse toResponse(Menu menu) {
        MenuResponse res = new MenuResponse();
        res.setId(menu.getId());
        res.setMenuCode(menu.getMenuCode());
        res.setMenuName(menu.getMenuName());
        res.setUrl(menu.getUrl());
        res.setIcon(menu.getIcon());
        res.setSortOrder(menu.getSortOrder());
        res.setActive(menu.isActive());
        res.setParentId(menu.getParent() != null ? menu.getParent().getId() : null);
        res.setChildren(menu.getChildren().stream()
                .filter(Menu::isActive)
                .map(this::toResponse)
                .collect(Collectors.toList()));
        return res;
    }

    private MenuResponse toResponseFlat(Menu menu) {
        MenuResponse res = new MenuResponse();
        res.setId(menu.getId());
        res.setMenuCode(menu.getMenuCode());
        res.setMenuName(menu.getMenuName());
        res.setUrl(menu.getUrl());
        res.setIcon(menu.getIcon());
        res.setSortOrder(menu.getSortOrder());
        res.setActive(menu.isActive());
        res.setParentId(menu.getParent() != null ? menu.getParent().getId() : null);
        return res;
    }
}
